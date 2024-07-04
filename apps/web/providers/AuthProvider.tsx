import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Amplify } from "aws-amplify";
import { signIn, confirmSignIn, AuthSession, signOut } from "aws-amplify/auth";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { fetchAuthSession } from "../helpers/cognito";
import { removeAccessToken } from "../utils/accessToken";

export const AuthContext = createContext<IAuthContext>({
  handleSignIn: undefined,
  handleVerification: undefined,
  handleSignOut: undefined,
  email: undefined,
});

interface IAuthContext {
  handleSignIn: (email: string) => Promise<void>;
  handleVerification: (code: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  email: string;
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      // identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
      signUpVerificationMethod: "code", // 'code' | 'link'
      loginWith: {
        // OPTIONAL - Hosted UI configuration
        email: true,
      },
    },
  },
});

export const AuthProvider: React.FC<PropsWithChildren<IProps>> = (props) => {
  const [authSession, setAuthSession] = useState<AuthSession>();
  const [isFetchingSession, setFetchingSession] = useState(true);
  const [email, setEmail] = useState<string>();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = () => {
    setFetchingSession(true);

    fetchAuthSession()
      .then((session) => {
        setAuthSession(session);
        setFetchingSession(false);

        if (!session?.tokens?.idToken) {
          router.push(loginPathName);
        } else if(pathName === loginPathName) {
          router.push("/");
        }
      })
      .catch((err) => {
        console.error(err);
        setFetchingSession(false);
      });
  };

  const handleSignIn = async (email: string) => {
    setEmail(email);
    await signIn({
      username: email,
      options: {
        authFlowType: "CUSTOM_WITHOUT_SRP",
      },
    });

  };

  const handleVerification = async (code: string) => {
    await confirmSignIn({ challengeResponse: code });
    fetchSession();
  };

  const handleSignOut = async () => {
    removeAccessToken();
    await signOut();

    router.push(loginPathName);
  };

  const value: IAuthContext = useMemo(
    () => ({
      handleSignIn,
      handleVerification,
      handleSignOut,
      email,
    }),
    [email]
  );
  if (
    isFetchingSession ||
    (!isFetchingSession && pathName !== loginPathName && !authSession)
  ) {
    return <Skeleton className="h-[100vh] w-[100vw]" />;
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

const loginPathName = "/auth/login";
interface IProps {
  // Add your prop types here
}
export const useAuthContext = () => useContext(AuthContext);

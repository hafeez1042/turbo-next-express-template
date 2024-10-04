import React from "react";
import Link from "next/link";
import { Package2 } from "lucide-react";

export const Logo: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  return (
    <Link
      href="#"
      className={`group flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base ${isMobile ? "h-10 w-10" : "h-9 w-9 md:h-8 md:w-8"}`}
    >
      <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
      <span className="sr-only">Acme Inc</span>
    </Link>
  );
};

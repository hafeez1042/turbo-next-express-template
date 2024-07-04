import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./../../lib/utils"

const buttonVariants = cva(
  "h-12 pl-4 pr-[22px] py-2 rounded-[999px] justify-center items-center gap-2 inline-flex text-[15px] ease-in-out duration-300 leading-none font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white bg-opacity-20 text-white hover:bg-white hover:text-green-800 active:bg-white active:text-green-900",
        primary: "bg-green-100 text-gray-900 text-white hover:bg-green-800 hover:text-white active:bg-green-800 active:text-white disabled:pointer-events-none disabled:opacity-50",
        active: "bg-white text-green-800 disabled:pointer-events-none disabled:opacity-50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-green-100 hover:text-green-800 ease-in-out duration-300",
        secondary:
          "bg-transprant rounded-full justify-center items-center gap-2 hover:bg-green-100 hover:text-green-800 active:bg-green-100 active:text-white ease-in-out duration-300",
        secondaryactive:
            "bg-green-100 text-green-800",
        tertiary: "bg-green-800 text-white hover:bg-[#204f46] ease-in-out duration-300",
        ghost: "hover:bg-gray-200 hover:text-accent-foreground",
        list:"bg-white border-t border-b border-gray-900 border-opacity-10 justify-start items-center flex",
        link: "text-primary underline-offset-4 hover:underline ease-in-out duration-300",
        textonly: "text-white text-opacity-40 text-lg font-normal hover:text-gray-900 hover:font-medium ease-in-out duration-300",
        iconbtn:"bg-green-100 rounded-xl justify-center items-center flex text-green-800 hover:bg-green-800 hover:text-white ease-in-out duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
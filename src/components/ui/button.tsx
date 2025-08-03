import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const buttonVariants = cva(
  "cursor-pointer hover:opacity-75 text-center rounded text-white px-3 py-2 bg-fuchsia-600 active:scale-[98%]",
  {
    variants: {
      variant: {
        linkButton: "underline text-blue-600",
      },
      size: {
        default: "w-full",
        sm: "w-10",
      },
      icon: {
        arrowLeft: "group flex items-center gap-3 justify-center",
        arrowRight: "group flex items-center gap-3 justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "size">,
    VariantProps<typeof buttonVariants>,
    Partial<Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">> {
  as?: React.ElementType;
  type?: "button" | "submit" | "reset";
  ref?: React.RefObject<HTMLButtonElement | null>;
}

export default function Button({
  as = "button",
  type = "button",
  ref,
  size,
  variant,
  icon,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const Component = href ? Link : as;
  return (
    <Component
      ref={ref}
      type={type}
      href={href}
      className={cn(buttonVariants({ size, variant, icon }), className)}
      {...props}
    >
      {icon == "arrowLeft" && (
        <ArrowLeft className="size-5 group-hover:size-6 group-hover:-translate-x-2 duration-150" />
      )}
      {children}
      {icon == "arrowRight" && (
        <ArrowRight className="size-5 group-hover:size-6 group-hover:translate-x-2 duration-150" />
      )}
    </Component>
  );
}

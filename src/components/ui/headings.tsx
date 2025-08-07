import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
const headingVarients = cva("scroll-m-20 tracking-tight my-1", {
  variants: {
    size: {
      default: "text-2xl font-semibold",
      lg: "text-3xl font-bold",
      xl: "text-4xl font-extrabold",
      xxl: "text-6xl font-extrabold",
    },
    variant: {
      glass:
        "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 shadow-2xl text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300",
    },
    asError: {
      true: "text-center text-sm text-rose-600 font-normal",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof headingVarients> {
  as: React.ElementType;
}

export default function Heading({
  as = "h2",
  size,
  asError,
  variant,
  className,
  ...props
}: HeadingProps) {
  const Component = as;
  return (
    <Component
      className={cn(headingVarients({ size, variant, asError }), className)}
      {...props}
    />
  );
}

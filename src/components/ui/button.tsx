import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";

const buttonVariants = cva("cursor-pointer hover:opacity-75 text-center", {
  variants: {
    variant: {
      default: "rounded text-white px-3 py-2 bg-fuchsia-600",
      linkButton: "underline text-blue-600",
    },
    size: {
      default: "w-full",
      sm: "w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "size">,
    VariantProps<typeof buttonVariants>,
    Partial<Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">> {
  as?: React.ElementType;
}

export default function Button({
  as = "button",
  size,
  variant,
  href,
  className,
  ...props
}: ButtonProps) {
  const Component = href ? Link : as;
  return (
    <Component
      href={href}
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  );
}

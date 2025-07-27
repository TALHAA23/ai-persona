import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "rounded placeholder:text-sm placeholder:font-light placeholder:capitalize placeholder:opacity-75 text-sm text-black/75 focus:outline-none px-2 my-0.5",
  {
    variants: {
      variant: {
        default: "border h-8",
        glass:
          "border border-white/30 w-full bg-white/10 backdrop-blur-sm h-10 focus:border-white/50 focus:bg-white/15 transition-all duration-300 hover:bg-white/15",
      },
      size: {
        default: "w-full",
        "1/2": "w-1/2",
        "1/3": "w-1/3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export default function Input({
  className,
  variant,
  size,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  );
}

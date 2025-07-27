import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";

const labelVariants = cva("text-sm", {
  variants: {
    variant: {
      normal: "text-white",
      error: "text-red-500",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

interface LabelProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof labelVariants> {
  htmlFor: string;
}

export default function Label({
  className,
  htmlFor,
  variant,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      {...props}
      className={cn(labelVariants({ variant }), className)}
    />
  );
}

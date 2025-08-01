import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";

const textAreaVariants = cva(
  "resize-none rounded p-2 border focus:outline-none text-sm text-white/90",
  {
    variants: {
      variant: {
        default: "",
        glass:
          "border border-white/30 w-full bg-white/10 backdrop-blur-sm h-10 focus:border-white/50 focus:bg-white/15 transition-all duration-300 hover:bg-white/15",
      },
      size: {
        default: "w-full",
        "1/2": "w-1/2",
      },
      height: {
        default: "h-20",
        full: "h-full",
        sm: "h-10",
        md: "h-24",
        lg: "h-40",
        xl: "h-60",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      height: "default",
    },
  }
);

interface TextAreaProps
  extends Omit<
      React.InputHTMLAttributes<HTMLTextAreaElement>,
      "size" | "height"
    >,
    VariantProps<typeof textAreaVariants> {
  //   children: React.ReactNode;
}

export default function TextArea({
  className,
  variant,
  size,
  height,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={cn(textAreaVariants({ variant, size, height }), className)}
      {...props}
    ></textarea>
  );
}

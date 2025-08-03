import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import TooltipPortal from "./tooltip";
import { CircleQuestionMark } from "lucide-react";

const labelVariants = cva("text-sm text-inherit", {
  variants: {
    variant: {
      normal: "",
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
  fieldInfo?: string;
}

export default function Label({
  className,
  htmlFor,
  variant,
  fieldInfo,
  ...props
}: LabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label
        htmlFor={htmlFor}
        {...props}
        className={cn(labelVariants({ variant }), className)}
      />
      {fieldInfo && (
        <TooltipPortal tooltip={fieldInfo}>
          <CircleQuestionMark className="size-4" />
        </TooltipPortal>
      )}
    </div>
  );
}

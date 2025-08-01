"use client";

import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const glassVariant =
  "border border-white/30 w-full bg-white/10 backdrop-blur-sm h-10 focus:border-white/50 focus:bg-white/15 transition-all duration-300 hover:bg-white/15";

interface SelectContextType {
  open: boolean;
  selected: string | null;
  setOpen: (val: boolean) => void;
  setSelected: (val: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

const selectVariants = cva("relative", {
  variants: {
    size: {
      default: "w-full grow",
      "1/2": "w-1/2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SelectProps
  extends Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "size" | "onChange"
    >,
    VariantProps<typeof selectVariants> {
  children: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
}

export function Select({
  children,
  size,
  className,
  value,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const setSelected = (val: string) => {
    onChange(val);
  };

  return (
    <SelectContext.Provider
      value={{ open, setOpen, selected: value, setSelected }}
    >
      <div className={cn(selectVariants({ size }), className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("Must be used inside <Select />");
  return context;
};

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input my-2 px-3 py-2 text-sm hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variants: {
        default: "",
        glass: glassVariant,
      },
      error: {
        true: "border border-red-500 shadow",
        false: "",
      },
    },
    defaultVariants: {
      variants: "default",
    },
  }
);

interface SelectTriggerProps
  extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  className?: string;
}

export function SelectTrigger({
  placeholder = "Select...",
  variants,
  error,
  className,
}: SelectTriggerProps) {
  const { open, setOpen, selected } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(selectTriggerVariants({ variants, error }), className)}
    >
      <span>
        {selected || (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </span>
      {open ? (
        <ChevronUpIcon className="size-4 opacity-50" />
      ) : (
        <ChevronDownIcon className="size-4 opacity-50" />
      )}
    </button>
  );
}

const selectContentVariants = cva(
  "absolute z-50 w-full rounded-md bg-popover shadow-md",
  {
    variants: {
      variant: {
        default: "bg-white/90 text-black",
        glass: glassVariant,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SelectContentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof selectContentVariants> {
  children: ReactNode;
}

export function SelectContent({
  children,
  variant,
  className,
}: SelectContentProps) {
  const { open, setOpen } = useSelectContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(cn(selectContentVariants({ variant }), className))}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

export function SelectItem({ children, value }: SelectItemProps) {
  const { setSelected, setOpen, selected } = useSelectContext();

  const handleSelect = () => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm hover:opacity-85 hover:text-accent-foreground",
        selected === value && "bg-muted"
      )}
    >
      {children}
    </div>
  );
}

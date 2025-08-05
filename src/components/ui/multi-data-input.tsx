import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import { PlusSquare, XCircle } from "lucide-react";
import { useRef } from "react";

const multiDataInputVariants = cva(
  "peer pl-2 w-full border-0 border-b h-10 focus:outline-none ",
  {
    variants: {
      error: {
        true: " rounded shadow border-red-500",
      },
    },
  }
);

interface MultiDataInput
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof multiDataInputVariants> {
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  items?: string[];
}

export default function MultiDataInput({
  items = [],
  setItems,
  className,
  error,
  ...props
}: MultiDataInput) {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleItemAdd = () => {
    const value = inputEl.current?.value;
    if (!value) return;
    setItems((prev) => [...prev, value]);
    if (inputEl.current) inputEl.current.value = "";
  };

  const handleItemDelete = (deleteIndex: number) => {
    const newItems = items.filter((item, index) => index !== deleteIndex);
    setItems(newItems);
  };

  return (
    <div>
      {items.length > 0 && (
        <div className="thin-scrollbar flex flex-nowrap gap-1 overflow-x-auto py-2.5">
          {items.map((item, index) => (
            <p
              className="relative text-xs border rounded-full px-2 py-0.5 cursor-pointer"
              key={item}
            >
              {item}
              <XCircle
                onClick={() => handleItemDelete(index)}
                className="size-4 absolute text-white -top-2 -right-2 bg-red-500 rounded-full cursor-pointer  [:not(peer-placeholder-shown)]:cursor-pointer"
              />
            </p>
          ))}
        </div>
      )}
      <div className="flex items-center">
        <input
          ref={inputEl}
          type="text"
          className={cn(multiDataInputVariants({ error }), className)}
          {...props}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleItemAdd();
            }
          }}
        />
        <PlusSquare
          className="hover:bg-green-500 rounded  duration-150  active:scale-95 cursor-no-drop  [:not(:peer-empty)]:cursor-pointer"
          onClick={handleItemAdd}
        />
      </div>
    </div>
  );
}

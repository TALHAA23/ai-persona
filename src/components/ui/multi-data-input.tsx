import { PlusSquare, XCircle } from "lucide-react";
import { useRef } from "react";

interface MultiDataInput extends React.InputHTMLAttributes<HTMLInputElement> {
  setItems: (val: string) => void;
  items?: string[];
}

export default function MultiDataInput({
  items = [],
  setItems,
}: MultiDataInput) {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleItemAdd = () => {
    const value = inputEl.current?.value;
    if (!value) return;
    setItems(value);
  };

  return (
    <div>
      {items.length > 0 && (
        <div className="thin-scrollbar flex gap-1 overflow-x-auto py-2.5">
          {items.map((item) => (
            <p
              className="group relative text-xs border rounded-full px-2 py-0.5 cursor-pointer"
              key={item}
            >
              {item}
              <XCircle className="size-4 absolute text-red-300 -top-2 -right-2 bg-red-500 rounded-full cursor-pointer invisible group-hover:visible" />
            </p>
          ))}
        </div>
      )}
      <div className="flex items-center">
        <input
          ref={inputEl}
          type="text"
          className="w-full border-0 border-b h-10 focus:outline-none"
        />
        <PlusSquare
          className=" hover:opacity-80 cursor-pointer active:scale-95"
          onClick={handleItemAdd}
        />
      </div>
    </div>
  );
}

import { XCircle } from "lucide-react";

export default function ObjectPreview({
  data,
  setData,
}: {
  data: Record<string, any>;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const handleDataUpdate = () => {
    if (setData)
      setData((prev) => {
        const newData = prev.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(data)
        );
        return newData;
      });
  };

  return (
    <div className="relative my-4 text-xs bg-white/60 rounded-md p-2  w-[150px] -rotate-3 h-[120px] font-mono border border-gray-300 shadow">
      <div
        className="whitespace-pre-wrap break-words overflow-hidden text-gray-800 h-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </div>
      {setData && (
        <XCircle
          onClick={handleDataUpdate}
          className="fill-red-500 absolute -top-2 -right-2 hover:opacity-85 cursor-pointer size-5"
        />
      )}
    </div>
  );
}

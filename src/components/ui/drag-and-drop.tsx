import { cn } from "@/utils/frontend/cn";
import { cva, VariantProps } from "class-variance-authority";
import { useRef, useState, DragEvent, ChangeEvent } from "react";

const dragDropVariants = cva(
  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 p-8 text-center",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400",
        glass:
          "border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:border-white/50 text-white/80",
      },
      size: {
        default: "min-h-[200px]",
        sm: "min-h-[150px] p-6",
        lg: "min-h-[300px] p-12",
      },
      state: {
        idle: "",
        dragover: "border-blue-500 bg-blue-50",
        dragoverGlass: "border-white/70 bg-white/25",
        error: "border-red-500 bg-red-50",
        errorGlass: "border-red-400/70 bg-red-400/15",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "idle",
    },
  }
);

interface DragDropProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof dragDropVariants> {
  onFileSelected: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  selectedFile?: File | null;
}

export default function DragDrop({
  className,
  variant = "default",
  size = "default",
  onFileSelected,
  accept,
  maxSize,
  disabled = false,
  error = false,
  helperText,
  selectedFile,
  children,
  ...props
}: DragDropProps) {
  const [dragState, setDragState] = useState<"idle" | "dragover">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGlass = variant === "glass";

  const getState = () => {
    if (error) return isGlass ? "errorGlass" : "error";
    if (dragState === "dragover") return isGlass ? "dragoverGlass" : "dragover";
    return "idle";
  };

  const validateFile = (file: File): File | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return null;
    }
    return file;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragState("dragover");
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset drag state if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragState("idle");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState("idle");

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFile = validateFile(files[0]); // Only take the first file

      if (validFile) {
        onFileSelected(validFile);
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length > 0) {
      const validFile = validateFile(files[0]); // Only take the first file

      if (validFile) {
        onFileSelected(validFile);
      }
    }

    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          dragDropVariants({ variant, size, state: getState() }),
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled}
        />

        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div
              className={cn(
                "rounded-full p-4 transition-colors",
                isGlass
                  ? "bg-white/20"
                  : dragState === "dragover"
                  ? "bg-blue-100"
                  : selectedFile
                  ? "bg-green-100"
                  : "bg-gray-200"
              )}
            >
              {selectedFile ? (
                <svg
                  className={cn(
                    "w-8 h-8",
                    isGlass ? "text-white/80" : "text-green-600"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className={cn(
                    "w-8 h-8",
                    isGlass ? "text-white/80" : "text-gray-600"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
            </div>

            <div className="text-center space-y-2">
              {selectedFile ? (
                <>
                  <p
                    className={cn(
                      "text-lg font-medium",
                      isGlass ? "text-white/90" : "text-green-700"
                    )}
                  >
                    {selectedFile.name}
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isGlass ? "text-white/70" : "text-gray-500"
                    )}
                  >
                    {formatFileSize(selectedFile.size)} • Click to change
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={cn(
                      "text-lg font-medium",
                      isGlass ? "text-white/90" : "text-gray-900"
                    )}
                  >
                    {dragState === "dragover"
                      ? "Drop file here"
                      : "Drop file here, or click to select"}
                  </p>

                  <p
                    className={cn(
                      "text-sm",
                      isGlass ? "text-white/70" : "text-gray-500"
                    )}
                  >
                    {accept && `Accepted formats: ${accept}`}
                    {maxSize &&
                      `${accept ? " • " : ""}Max size: ${formatFileSize(
                        maxSize
                      )}`}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <p
          className={cn(
            "mt-2 text-sm",
            error ? "text-red-600" : isGlass ? "text-white/70" : "text-gray-600"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

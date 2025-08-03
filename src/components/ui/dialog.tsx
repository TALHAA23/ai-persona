import {
  closeDialogCenterToBottom,
  showDialogFromTop,
} from "@/animations/dialog-box-animes";
import { XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface DialogProps extends React.HTMLAttributes<HTMLDialogElement> {
  trigger?: React.RefObject<HTMLButtonElement | null>;
}

export default function Dialog({ children, trigger, ...props }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleClose = () => {
    closeDialogCenterToBottom(dialogRef);
  };

  useEffect(() => {
    if (trigger?.current) {
      trigger.current.onclick = () => {
        dialogRef.current?.showModal();
        showDialogFromTop(dialogRef);
      };
    }
  }, [trigger]);

  return (
    <dialog
      ref={dialogRef}
      {...props}
      className="el relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3  rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm  overflow-visible"
    >
      {children}

      <XCircle
        onClick={handleClose}
        className="absolute -top-2 -right-2 cursor-pointer hover:opacity-70 fill-rose-700"
      />
    </dialog>
  );
}

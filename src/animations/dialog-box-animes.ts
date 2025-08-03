import { animate } from "animejs";

export function showDialogFromTop(
  dialogRef: React.RefObject<HTMLDialogElement | null>
) {
  if (dialogRef.current)
    return animate(dialogRef.current, {
      y: {
        from: "-500%",
        to: 0,
        ease: "inOut",
      },
      opacity: {
        from: 0,
        to: 1,
      },
      duration: 500,
    });
}
export function closeDialogCenterToBottom(
  dialogRef: React.RefObject<HTMLDialogElement | null>
) {
  if (dialogRef.current)
    return animate(dialogRef.current, {
      y: {
        from: "0",
        to: "400%",
        ease: "inOut",
      },
      opacity: {
        from: 1,
        to: 0,
      },
      duration: 500,
      onComplete: () => dialogRef.current?.close(),
    });
}

import { animate } from "animejs";

export function showDialogFromTop(dialogRef: HTMLDialogElement | null) {
  if (dialogRef)
    return animate(dialogRef, {
      y: {
        from: "-100%",
        to: 0,
        ease: "inOut",
      },
      opacity: {
        from: 0,
        to: 1,
      },
      duration: 1000,
    });
}
export function closeDialogCenterToBottom(dialogRef: HTMLDialogElement | null) {
  if (dialogRef)
    return animate(dialogRef, {
      y: {
        from: "0",
        to: "20%",
        ease: "inOut",
      },
      opacity: {
        from: 1,
        to: 0,
      },
      duration: 1000,
      onComplete: () => dialogRef?.close(),
    });
}

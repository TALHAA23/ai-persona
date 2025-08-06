import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import { animate, stagger } from "animejs";

export default function formFieldsShowingUp(startDelay = 1500) {
  animate(["." + ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING], {
    opacity: { from: 0, to: 1 },
    delay: stagger(100, { start: startDelay }),
    duration: 500,
  });
}

import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import { animate } from "animejs";
export default function formSlideUp() {
  animate("." + ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP, {
    y: [
      {
        from: "100%",
      },
    ],
    duration: 1500,
  });
}

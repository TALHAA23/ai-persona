import { animate, stagger } from "animejs";

export default function formFieldsShowingUp() {
  animate([".animated-field-showing"], {
    opacity: { from: 0, to: 1 },
    delay: stagger(100, { start: 1500 }),
    duration: 500,
  });
}

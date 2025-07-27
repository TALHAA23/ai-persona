import { animate, stagger } from "animejs";
export default function formSlideUp() {
  animate(".animate-form-slide-up", {
    y: [
      {
        from: "100%",
      },
    ],
    duration: 1500,
  });

  animate(".form-field", {
    opacity: { from: 0, to: 1 },
    delay: stagger(100, { start: 1500 }),
    duration: 500,
  });
}

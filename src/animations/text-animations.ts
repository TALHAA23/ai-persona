import { createTimeline, stagger, text } from "animejs";

export function textSlideDown() {
  const { words } = text.split(".animate-word-slide-down", {
    words: { wrap: "clip" },
    chars: true,
  });

  createTimeline({
    defaults: { ease: "inOut(3)", duration: 1500 },
  })
    .add(
      words,
      {
        y: [($el) => (+$el.dataset.line % 2 ? "100%" : "-100%"), "0%"],
      },
      stagger(125)
    )
    .init();
}

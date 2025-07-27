"use client";
import { useEffect, useRef } from "react";
import { animate, createScope, type Scope } from "animejs";
import formSlideUp from "@/animations/formSlideUp";
import Heading from "../ui/headings";
import { textSlideDown } from "@/animations/text-animations";

export default function BasicInfo() {
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add((s) => {
      const a = s?.root.querySelectorAll(".test");
      if (a)
        animate(a, {
          x: {
            to: 100,
          },
        });

      formSlideUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <div
      ref={root}
      className="frame bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden text-black"
    >
      <Heading
        as={"h1"}
        size={"xxl"}
        variant={"glass"}
        className="animate-word-slide-down"
      >
        Basic Information
      </Heading>
      <h1 className="test">hello world</h1>
      <h1 className="test">hello world</h1>
      <h1 className="test">hello world</h1>
      <div className="animate-form-slide-up w-[90%] max-w-[600px] h-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"></div>
    </div>
  );
}

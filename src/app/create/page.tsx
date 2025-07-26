"use client";
import {
  animate,
  createDraggable,
  createScope,
  createSpring,
  Scope,
} from "animejs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Create() {
  const root = useRef(null);
  const scope = useRef<Scope>(null);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      animate(".logo", {
        scale: [
          { to: 1.25, ease: "inOut(3)", duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) },
        ],
        loop: true,
        loopDelay: 250,
      });
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      self?.add("rotateLogo", (i) => {
        animate(".logo", {
          rotate: i * 360,
          ease: "out(4)",
          duration: 1500,
        });
      });
    });

    return () => scope?.current?.revert();
  }, []);

  useEffect(() => {
    if (rotate == 4) {
      console.log("anomate");
      animate(".btn", {
        rotate: 360,
        ease: "inElastic",
        duration: 1500,
      });
    }
  }, [rotate]);

  const handleClick = () => {
    setRotate((prev) => {
      const newRotation = prev + 1;
      scope.current?.methods.rotateLogo(newRotation);
      return newRotation;
    });
  };

  return (
    <div
      ref={root}
      className=" flex items-center justify-center h-screen flex-col gap-1.5 bg-gradient-to-b from-fuchsia-600 to-fuchsia-800 via-fuchsia-500"
    >
      <div className=" flex items-center justify-center bg-blue-300 rounded p-5">
        <Image
          className="logo"
          src={"/react-svgrepo-com.svg"}
          alt="react"
          height={80}
          width={80}
        />
      </div>
      <button
        onClick={handleClick}
        className="btn bg-blue-400 px-4 py-1 rounded text-black hover:opacity-65 active:scale-90"
      >
        Rotate: {rotate}
      </button>
      <button className="glass-btn relative px-8 py-3 rounded-2xl font-semibold text-white backdrop-blur-lg bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 group">
        <span className="relative z-10">Frosted Action</span>

        <span className="absolute inset-0 z-0 rounded-2xl border border-white/10 group-hover:border-white/30 transition duration-300 ease-in-out pointer-events-none"></span>

        <span className="absolute inset-0 rounded-2xl group-hover:shadow-[0_0_40px_5px_rgba(255,255,255,0.07)] transition duration-300 pointer-events-none"></span>

        <span className="shine"></span>
      </button>
    </div>
  );
}

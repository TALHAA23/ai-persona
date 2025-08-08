import { useEffect, useRef } from "react";
import Heading from "../ui/headings";
import { createScope, Scope } from "animejs";
import formSlideUp from "@/animations/formSlideUp";
import { textSlideDown } from "@/animations/text-animations";
import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import Button from "../ui/button";
import useFormNavigator from "@/hooks/use-form-navigator";
import { PersonaCreationFormProps } from "@/types/types.client";
import { useFormSections } from "@/hooks/use-form-sections";

export default function Submission({ prev }: PersonaCreationFormProps) {
  const goto = useFormNavigator();
  const { submit } = useFormSections();
  const root = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope>(null);

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);
  return (
    <div
      ref={root}
      className="bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden text-black"
    >
      <Heading
        as={"h1"}
        size={"xxl"}
        variant={"glass"}
        className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
      >
        Finalize Your Persona
      </Heading>
      {/* form */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " h-full flex flex-col gap-1.5 justify-center items-center text-white w-[90%] max-w-[600px]  bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        {prev && (
          <Button onClick={() => goto(prev)} icon={"arrowLeft"}>
            Go Back
          </Button>
        )}
        <Button
          onClick={submit}
          className=" bg-gradient-to-l from-emerald-600 to-emerald-700"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

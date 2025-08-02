"use client";
import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import Heading from "../ui/headings";
import { useEffect, useRef, useState } from "react";
import { createScope, Scope } from "animejs";
import formFieldsShowingUp from "@/animations/form-fields-showing-up";
import formSlideUp from "@/animations/formSlideUp";
import { textSlideDown } from "@/animations/text-animations";
import Button from "../ui/button";
import useFormNavigator from "@/hooks/use-form-navigator";
import Label from "../ui/label";
import Input from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { LanguageProficiencyEnum } from "@/types/enums";
import { capitalize } from "@/utils/frontend";
import { useFormSections } from "@/hooks/use-form-sections";
import MultiDataInput from "../ui/multi-data-input";

export default function CultureAndLanguageBackground() {
  const goto = useFormNavigator();
  const { state } = useFormSections();
  const prevData = useRef(state.cultureAndLanguageBackground).current;
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const [languageProficiency, setLanguageProficiency] = useState("");

  useEffect(() => {
    if (!root.current) return;

    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      formFieldsShowingUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);

  return (
    <form
      ref={root}
      className=" bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden text-black"
    >
      <Heading
        as="h1"
        size={"xl"}
        variant={"glass"}
        className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
      >
        Culture and Language Background
      </Heading>
      {/* main */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " flex flex-col justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          <div className="flex gap-1 items-center">
            <div className=" w-1/2">
              <Label htmlFor="native_language">Native Language</Label>
              <Input
                id="native_language"
                name="native_language"
                variant={"glass"}
                defaultValue={prevData?.native_language}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="language_Proficiency">Language Proficiency</Label>
              <Select
                value={languageProficiency}
                onChange={setLanguageProficiency}
              >
                <SelectTrigger
                  variants={"glass"}
                  placeholder="Language Proficiency"
                />
                <SelectContent>
                  {LanguageProficiencyEnum.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {capitalize(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              name="religion"
              defaultValue={prevData?.religion}
              variant={"glass"}
            />
          </div>
          <div>
            <Label htmlFor="cultural_identity">Cultural Identity</Label>
            <Input
              id="cultural_identity"
              name="cultural_identity"
              defaultValue={prevData?.cultural_identity}
              variant={"glass"}
            />
          </div>
          <Label htmlFor="other_languages">Other Languages</Label>
          <MultiDataInput />
        </div>
        <div className="w-full flex gap-1">
          <Button icon={"arrowLeft"} onClick={() => goto("basic")}>
            Previous
          </Button>
          <Button icon={"arrowRight"}>Next</Button>
        </div>
      </div>
    </form>
  );
}

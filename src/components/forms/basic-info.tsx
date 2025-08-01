"use client";
import { useEffect, useRef, useState } from "react";
import { createScope, type Scope } from "animejs";
import formSlideUp from "@/animations/formSlideUp";
import Heading from "../ui/headings";
import { textSlideDown } from "@/animations/text-animations";
import Label from "../ui/label";
import Input from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import Button from "../ui/button";
import formFieldsShowingUp from "@/animations/form-fields-showing-up";
import { useFormSections } from "@/hooks/use-form-sections";
import { BasicIdentitySchema } from "@/types/schemas.client";
import z from "zod";
import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";

const GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  PREFER_NOT_TO_SAY: "prefer_not_to_say",
};

export default function BasicInfo() {
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const [gender, setGender] = useState("");
  const { dispatch } = useFormSections();
  const [error, setError] =
    useState<
      z.inferFlattenedErrors<typeof BasicIdentitySchema>["fieldErrors"]
    >();

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      textSlideDown();
      formFieldsShowingUp();
    });

    return () => scope.current?.revert();
  }, []);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const additionalData = { ...data, gender };
    try {
      const parsed = BasicIdentitySchema.parse(additionalData);
      dispatch({ type: "UPDATE_BASIC_IDENTITY", payload: parsed });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.flatten().fieldErrors);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      ref={root}
      className=" bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden text-black"
    >
      <Heading
        as={"h1"}
        size={"xxl"}
        variant={"glass"}
        className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
      >
        Basic Information
      </Heading>
      {/* form */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " flex flex-col justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          <div className="flex gap-1">
            {["firstName", "lastName"].map((item, index) => (
              <div key={item} className="animated-field-showing grow">
                <Label className=" capitalize" htmlFor={item}>
                  {item.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  error={index == 0 ? !!error?.firstName : !!error?.lastName}
                  id={item}
                  name={item}
                  variant={"glass"}
                />
              </div>
            ))}
          </div>
          <div className={ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING}>
            <Label htmlFor="age">Age</Label>
            <Input
              error={!!error?.age}
              id="age"
              name="age"
              max={120}
              min={0}
              variant={"glass"}
              type="number"
            />
          </div>

          <Select
            className={ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING}
            value={gender}
            onChange={setGender}
          >
            <SelectTrigger
              error={!!error?.gender}
              placeholder="Choose Gender"
              variants={"glass"}
            />
            <SelectContent>
              <SelectItem value={GENDER_OPTIONS.MALE}>Male</SelectItem>
              <SelectItem value={GENDER_OPTIONS.FEMALE}>Female</SelectItem>
              <SelectItem value={GENDER_OPTIONS.PREFER_NOT_TO_SAY}>
                Perfer not to say
              </SelectItem>
            </SelectContent>
          </Select>
          <div className={ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING}>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              required
              variant={"glass"}
            />
          </div>
        </div>
        <Button
          type="submit"
          className={ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING}
        >
          Click Me
        </Button>
      </div>
    </form>
  );
}

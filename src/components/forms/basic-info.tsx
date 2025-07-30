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

export default function BasicInfo() {
  const { dispatch } = useFormSections();
  const [error, setError] =
    useState<
      z.inferFlattenedErrors<typeof BasicIdentitySchema>["fieldErrors"]
    >();
  console.log(error);
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);

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
    try {
      console.log(data);
      const parsed = BasicIdentitySchema.parse(data);
      console.log(parsed);
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
      {/* form */}
      <div className="animate-form-slide-up flex flex-col justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl">
        <div className="w-full">
          <div className="flex gap-1">
            {["firstName", "lastName"].map((item, index) => (
              <div key={item} className="animated-field-showing grow">
                <Label className=" capitalize" htmlFor={item}>
                  {item.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  error={
                    (index == 0 ? error?.firstName : error?.lastName)
                      ? "redBorder"
                      : "default"
                  }
                  id={item}
                  name={item}
                  variant={"glass"}
                />
              </div>
            ))}
          </div>
          <div className="animated-field-showing">
            <Label htmlFor="age">Age</Label>
            <Input
              error={error?.age ? "redBorder" : "default"}
              id="age"
              name="age"
              max={120}
              min={0}
              variant={"glass"}
              type="number"
            />
          </div>

          <Select className="animated-field-showing">
            <SelectTrigger placeholder="Choose Gender" variants={"glass"} />
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="perfer-not-to-say">
                Perfer not to say
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="animated-field-showing">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              required
              variant={"glass"}
            />
          </div>
        </div>
        <Button className="animated-field-showing">Click Me</Button>
      </div>
    </form>
  );
}

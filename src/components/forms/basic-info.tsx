"use client";
import { useEffect, useRef } from "react";
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

export default function BasicInfo() {
  const { dispatch } = useFormSections();
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      textSlideDown();
      formFieldsShowingUp();
    });

    return () => scope.current?.revert();
  }, []);

  function handleClick() {
    dispatch({ type: "RESET" });
  }

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
      {/* form */}
      <div className="animate-form-slide-up flex flex-col justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl">
        <div className="w-full">
          <div className="flex gap-1">
            {["firstName", "lastName"].map((item) => (
              <div key={item} className="animated-field-showing grow">
                <Label className=" capitalize" htmlFor={item}>
                  {item.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input id={item} name={item} variant={"glass"} />
              </div>
            ))}
          </div>
          <div className="animated-field-showing">
            <Label htmlFor="age">Age</Label>
            <Input
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
        <Button onClick={handleClick} className="animated-field-showing">
          Click Me
        </Button>
      </div>
    </div>
  );
}

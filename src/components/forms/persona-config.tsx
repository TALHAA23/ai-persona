"use client";
import { useEffect, useRef, useState } from "react";
import Heading from "../ui/headings";
import { createScope, Scope } from "animejs";
import formFieldsShowingUp from "@/animations/form-fields-showing-up";
import { textSlideDown } from "@/animations/text-animations";
import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import Label from "../ui/label";
import Input from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { capitalize } from "@/utils/frontend";
import TextArea from "../ui/textarea";
import Button from "../ui/button";
import z from "zod";
import { PersonaConfigurationSchema } from "@/types/schemas.client";
import { useFormSections } from "@/hooks/use-form-sections";

const OPTIONS = {
  TONE: [
    "formal",
    "casual",
    "friendly",
    "professional",
    "humorous",
    "empathetic",
    "conversational",
    "adaptive",
  ],
  TYPE: [
    "mentor",
    "friend",
    "professional",
    "teacher",
    "advisor",
    "storyteller",
    "creative",
    "adaptive",
  ],
  PRIVACY: ["public", "private"],
};

export default function PersonaConfig() {
  const { dispatch } = useFormSections();
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const [tone, setTone] = useState("");
  const [type, setType] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [error, setError] =
    useState<
      z.inferFlattenedErrors<typeof PersonaConfigurationSchema>["fieldErrors"]
    >();

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add(() => {
      formFieldsShowingUp();
      formFieldsShowingUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const additionalData = {
      ...data,
      global_settings: {
        default_tone: tone,
        default_persona_type: type,
        privacy_level: privacy,
      },
    };
    try {
      const parsed = PersonaConfigurationSchema.parse(additionalData);
      dispatch({ type: "UPDATE_PERSONA_CONFIGS", payload: parsed });
      setError(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.flatten().fieldErrors);
      }
    }
  };
  console.log(error);

  return (
    <form
      ref={root}
      onSubmit={handleSubmit}
      className="bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden text-black"
    >
      <Heading
        as={"h1"}
        size={"xxl"}
        variant={"glass"}
        className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
      >
        Persona Configuration
      </Heading>
      {/* form */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " h-full flex flex-col justify-between items-start text-white w-[90%] max-w-[600px]  bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          <div className={ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING}>
            <Label htmlFor="persona_name">Persona Name</Label>
            <Input
              error={!!error?.persona_name}
              variant={"glass"}
              id="persona_name"
              name="persona_name"
            />
          </div>
          <Select onChange={setTone} value={tone}>
            <SelectTrigger placeholder="Persona Tone" variants={"glass"} />
            <SelectContent>
              {OPTIONS.TONE.map((tone, index) => (
                <SelectItem key={index} value={tone}>
                  {capitalize(tone)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onChange={setType} value={type}>
            <SelectTrigger placeholder="Persona Type" variants={"glass"} />
            <SelectContent>
              {OPTIONS.TYPE.map((type, index) => (
                <SelectItem key={index} value={type}>
                  {capitalize(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onChange={setPrivacy} value={privacy}>
            <SelectTrigger placeholder="Visability" variants={"glass"} />
            <SelectContent>
              {OPTIONS.PRIVACY.map((privacy, index) => (
                <SelectItem key={index} value={privacy}>
                  {capitalize(privacy)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="persona_description">Description</Label>
          <TextArea
            name="persona_description"
            id="persona_description"
            variant={"glass"}
            placeholder="Describe your Persona"
          />
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

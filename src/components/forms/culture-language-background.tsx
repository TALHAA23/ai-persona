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
import { useFormSections } from "@/hooks/use-form-sections";
import MultiDataInput from "../ui/multi-data-input";
import z from "zod";
import { CulturalLanguageBackgroundSchema } from "@/types/schemas.client";

const CULTURAL_FIELD_INFO = {
  cultural_identity:
    "A broad label or affiliation that reflects your cultural background. Examples: South Asian, Pashtun, Arab, Western, African-American.",

  accents_or_dialects:
    "Any specific accents or regional dialects you speak with. This helps tailor speech styles for your chatbot. Examples: Lahori Urdu, British English, Chittagonian.",

  festivals_celebrated:
    "Festivals or holidays you observe that reflect your cultural or religious traditions. Examples: Eid, Ramadan, Diwali, Christmas.",

  customs_or_norms:
    "Unique social behaviors or etiquette practices you follow. Helps your chatbot understand boundaries and traditions. Examples: Avoids physical contact with opposite gender, Eats with right hand only.",

  cultural_references:
    "Common media, art, or cultural elements you relate to or grew up with. Useful for casual conversation or metaphors. Examples: Bollywood films, Pakistani dramas, Quranic stories, Sufi poetry.",
};

export default function CultureAndLanguageBackground() {
  const goto = useFormNavigator();
  const { dispatch, state } = useFormSections();
  const prevData = useRef(state.cultureAndLanguageBackground).current;
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const [errors, setErrors] =
    useState<
      z.inferFlattenedErrors<
        typeof CulturalLanguageBackgroundSchema
      >["fieldErrors"]
    >();
  const [otherLanguages, setOtherLanguages] = useState([
    ...(prevData?.other_languages || []),
  ]);
  const [accentsOrDialects, setAccentsOrDialects] = useState<string[]>([
    ...(prevData?.accents_or_dialects || []),
  ]);

  const [festivalsCelebrated, setFestivalsCelebrated] = useState<string[]>([
    ...(prevData?.festivals_celebrated || []),
  ]);

  const [customsOrNorms, setCustomsOrNorms] = useState<string[]>([
    ...(prevData?.customs_or_norms || []),
  ]);

  const [culturalReferences, setCulturalReferences] = useState<string[]>([
    ...(prevData?.cultural_references || []),
  ]);

  useEffect(() => {
    if (!root.current) return;

    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      formFieldsShowingUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(undefined);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const additionalData = {
      ...data,
      other_languages: otherLanguages,
      accents_or_dialects: accentsOrDialects,
      festivals_celebrated: festivalsCelebrated,
      customs_or_norms: customsOrNorms,
      cultural_references: culturalReferences,
    };
    try {
      const parsed = CulturalLanguageBackgroundSchema.parse(additionalData);
      dispatch({
        type: "UPATE_CULTURE_AND_LANGUAGE_BACKGROUND",
        payload: parsed,
      });
      goto("personality-and-beliefs");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  console.log(errors);

  return (
    <form
      ref={root}
      onSubmit={handleSubmit}
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
          " flex flex-col gap-2 justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          <Label htmlFor="native_language">Native Language</Label>
          <Input
            id="native_language"
            name="native_language"
            variant={"glass"}
            error={!!errors?.native_language}
            defaultValue={prevData?.native_language}
          />
          <Label htmlFor="other_languages">Other Languages</Label>
          <MultiDataInput
            id="other_languages"
            items={otherLanguages}
            setItems={setOtherLanguages}
          />
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              name="religion"
              defaultValue={prevData?.religion}
              variant={"glass"}
              error={!!errors?.religion}
            />
          </div>
          <div>
            <Label
              htmlFor="cultural_identity"
              fieldInfo={CULTURAL_FIELD_INFO.cultural_identity}
            >
              Cultural Identity
            </Label>
            <Input
              id="cultural_identity"
              name="cultural_identity"
              defaultValue={prevData?.cultural_identity}
              variant={"glass"}
              error={!!errors?.cultural_identity}
            />
          </div>
          <Label
            htmlFor="accents_or_dialects"
            fieldInfo={CULTURAL_FIELD_INFO.accents_or_dialects}
          >
            Accents or Dialects
          </Label>
          <MultiDataInput
            id="accents_or_dialects"
            items={accentsOrDialects}
            setItems={setAccentsOrDialects}
          />

          <Label
            htmlFor="festivals_celebrated"
            fieldInfo={CULTURAL_FIELD_INFO.festivals_celebrated}
          >
            Festivals Celebrated
          </Label>
          <MultiDataInput
            id="festivals_celebrated"
            items={festivalsCelebrated}
            setItems={setFestivalsCelebrated}
          />

          <Label
            htmlFor="customs_or_norms"
            fieldInfo={CULTURAL_FIELD_INFO.customs_or_norms}
          >
            Customs or Norms
          </Label>
          <MultiDataInput
            id="customs_or_norms"
            items={customsOrNorms}
            setItems={setCustomsOrNorms}
          />

          <Label
            htmlFor="cultural_references"
            fieldInfo={CULTURAL_FIELD_INFO.cultural_references}
          >
            Cultural References
          </Label>
          <MultiDataInput
            id="cultural_references"
            items={culturalReferences}
            setItems={setCulturalReferences}
          />
        </div>
        <div className="w-full flex gap-1">
          <Button icon={"arrowLeft"} onClick={() => goto("basic")}>
            Previous
          </Button>
          <Button type="submit" icon={"arrowRight"}>
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}

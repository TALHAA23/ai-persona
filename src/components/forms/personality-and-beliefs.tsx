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
import { PersonalityAndBeliefsSchema } from "@/types/schemas.client";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  EmotionalExpressionLevelEnum,
  PersonalityTypeEnum,
  PersonaToneEnum,
} from "@/types/enums";
import { capitalize } from "@/utils/frontend";

const PERSONALITY_FIELD_INFO = {
  communication_style:
    "How you naturally communicate. Helps your chatbot mirror your speaking style. Examples: Direct, empathetic, formal, casual.",
  core_values:
    "The fundamental principles you live by. Helps guide your chatbot's behavior. Examples: Honesty, compassion, independence.",
  default_tone:
    "The default tone your chatbot should use in conversations. Examples: Friendly, professional, playful.",
  introvert_or_extrovert:
    "Your general social energy style. Helps the chatbot decide how outgoing or reserved it should be.",
  humor_style:
    "If your chatbot should be funny, what kind of humor should it use? Examples: Witty, sarcastic, dry.",
  belief_system:
    "Your overall worldview or spiritual outlook. Optional, but adds philosophical depth.",
  political_view:
    "Optional political stance. Useful if the chatbot may answer on your behalf in debates or opinion topics.",
  emotional_expression_level:
    "How openly you express emotions. Helps the chatbot decide whether to be reserved or expressive.",
  sensitive_topics_to_avoid:
    "Topics you prefer your chatbot not to comment on. Examples: Religion, personal trauma.",
  personality_traits:
    "Words that describe your personality. These shape the chatbot's tone and behavior.",
};

export default function PersonalityAndBeliefs() {
  const goto = useFormNavigator();
  const { dispatch, state } = useFormSections();
  const prevData = useRef(state.personalityAndBeliefs).current;
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const [errors, setErrors] =
    useState<
      z.inferFlattenedErrors<typeof PersonalityAndBeliefsSchema>["fieldErrors"]
    >();
  const [defaultTone, setDefaultTone] = useState(prevData?.default_tone || "");
  const [emotionalExpressionLevel, setEmotionalExpressionLevel] = useState(
    prevData?.emotional_expression_level || ""
  );
  const [personalityType, setPersonalityType] = useState(
    prevData?.introvert_or_extrovert || ""
  );
  const [coreValues, setCoreValues] = useState([
    ...(prevData?.core_values || []),
  ]);
  const [sensitiveTopicsToAvoid, setSensitiveTopicsToAvoid] = useState<
    string[]
  >([...(prevData?.sensitive_topics_to_avoid || [])]);

  const [personalityTraits, setPersonalityTraits] = useState<string[]>([
    ...(prevData?.personality_traits || []),
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
      default_tone: defaultTone,
      introvert_or_extrovert: personalityType,
      core_values: coreValues,
      sensitive_topics_to_avoid: sensitiveTopicsToAvoid,
      personality_traits: personalityTraits,
      emotional_expression_level: emotionalExpressionLevel,
    };
    try {
      const parsed = PersonalityAndBeliefsSchema.parse(additionalData);
      dispatch({
        type: "UPDATE_PERSONALITY_AND_BELIEFS",
        payload: parsed,
      });
      goto("education-background");
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
      className=" bg-fuchsia-400 w-full h-screen flex flex-col items-center overflow-hidden  text-black"
    >
      <Heading
        as="h1"
        size={"xxl"}
        variant={"glass"}
        className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
      >
        Personality and Beliefs
      </Heading>
      {/* main */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " thin-scrollbar flex flex-col gap-2 justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto  p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          <Label
            htmlFor="communication_style"
            fieldInfo={PERSONALITY_FIELD_INFO.communication_style}
          >
            Communication Style
          </Label>
          <Input
            id="communication_style"
            name="communication_style"
            variant={"glass"}
            error={!!errors?.communication_style}
            defaultValue={prevData?.communication_style}
          />

          <Label
            htmlFor="core_values"
            fieldInfo={PERSONALITY_FIELD_INFO.core_values}
          >
            Core Values
          </Label>
          <MultiDataInput
            id="core_values"
            items={coreValues}
            setItems={setCoreValues}
            error={!!errors?.core_values}
          />

          <div>
            <Label htmlFor="default_tone">Default Tone</Label>
            <Select onChange={setDefaultTone} value={defaultTone}>
              <SelectTrigger
                placeholder="Select Default Tone"
                variants={"glass"}
                error={!!errors?.default_tone}
              />
              <SelectContent>
                {PersonaToneEnum.options.map((item) => (
                  <SelectItem key={item} value={item}>
                    {capitalize(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="introvert_or_extrovert">
              Introvert or Extrovert
            </Label>
            <Select onChange={setPersonalityType} value={personalityType}>
              <SelectTrigger
                placeholder="Select Personality Type"
                variants={"glass"}
                error={!!errors?.introvert_or_extrovert}
              />
              <SelectContent>
                {PersonalityTypeEnum.options.map((item) => (
                  <SelectItem key={item} value={item}>
                    {capitalize(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="humor_style"
              fieldInfo={PERSONALITY_FIELD_INFO.humor_style}
            >
              Humor Style
            </Label>
            <Input
              id="humor_style"
              name="humor_style"
              defaultValue={prevData?.humor_style}
              variant={"glass"}
              error={!!errors?.humor_style}
            />
          </div>

          <div>
            <Label
              htmlFor="belief_system"
              fieldInfo={PERSONALITY_FIELD_INFO.belief_system}
            >
              Belief System
            </Label>
            <Input
              id="belief_system"
              name="belief_system"
              defaultValue={prevData?.belief_system}
              variant={"glass"}
              error={!!errors?.belief_system}
            />
          </div>

          <div>
            <Label
              htmlFor="political_view"
              fieldInfo={PERSONALITY_FIELD_INFO.political_view}
            >
              Political View
            </Label>
            <Input
              id="political_view"
              name="political_view"
              defaultValue={prevData?.political_view}
              variant={"glass"}
              error={!!errors?.political_view}
            />
          </div>

          <div>
            <Label htmlFor="emotional_expression_level">
              Emotional Expression Level
            </Label>
            <Select
              onChange={setEmotionalExpressionLevel}
              value={emotionalExpressionLevel}
            >
              <SelectTrigger
                placeholder="Select Emotional Expression Level"
                variants={"glass"}
                error={!!errors?.emotional_expression_level}
              />
              <SelectContent>
                {EmotionalExpressionLevelEnum.options.map((item) => (
                  <SelectItem key={item} value={item}>
                    {capitalize(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label
            htmlFor="sensitive_topics_to_avoid"
            fieldInfo={PERSONALITY_FIELD_INFO.sensitive_topics_to_avoid}
          >
            Sensitive Topics to Avoid
          </Label>
          <MultiDataInput
            id="sensitive_topics_to_avoid"
            items={sensitiveTopicsToAvoid}
            setItems={setSensitiveTopicsToAvoid}
          />

          <Label
            htmlFor="personality_traits"
            fieldInfo={PERSONALITY_FIELD_INFO.personality_traits}
          >
            Personality Traits
          </Label>
          <MultiDataInput
            id="personality_traits"
            items={personalityTraits}
            setItems={setPersonalityTraits}
          />
        </div>
        <div className="w-full flex gap-1">
          <Button
            icon={"arrowLeft"}
            onClick={() => goto("culture-and-language-background")}
          >
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

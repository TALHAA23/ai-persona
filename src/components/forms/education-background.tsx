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
import {
  EducationBackgroundSchema,
  EducationHistoryItemSchema,
} from "@/types/schemas.client";
import Dialog from "../ui/dialog";
import { closeDialogCenterToBottom } from "@/animations/dialog-box-animes";
import ObjectPreview from "../ui/object-preview";

const EDUCATION_FIELD_INFO = {
  highest_degree:
    "Your most advanced level of education. Examples: Bachelor's, Master's, Diploma.",
  field_of_study:
    "What subject you studied. Examples: Software Engineering, Psychology, Business.",
  institution_name: "Name of the university, college, or institution.",
  graduation_year: "The year you completed or expect to complete this degree.",
  gpa_or_grade: "Your final grade or GPA, if you wish to share it.",
  education_history: "List of previous degrees or diplomas you've completed.",
  academic_achievements: "Any academic honors, awards, or recognitions.",
  favorite_subjects: "Subjects you enjoyed or excelled in during your studies.",
  learning_style:
    "How you prefer to learn. Examples: Visual, Auditory, Reading/Writing.",
  academic_interests:
    "Subjects or areas you're naturally curious about, even outside your main degree.",
};

export default function EducationBackground() {
  const goto = useFormNavigator();
  const { dispatch, state } = useFormSections();
  const prevData = useRef(state.educationBackground).current;
  const scope = useRef<Scope>(null);
  const root = useRef<HTMLFormElement>(null);
  const addEduButtonRef = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] =
    useState<
      z.inferFlattenedErrors<typeof EducationBackgroundSchema>["fieldErrors"]
    >();
  const [educationHistoryErrors, setEducationHistoryErrors] =
    useState<
      z.inferFlattenedErrors<typeof EducationHistoryItemSchema>["fieldErrors"]
    >();
  const [academicAchievements, setAcademicAchievements] = useState([
    ...(prevData?.academic_achievements || []),
  ]);
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>([
    ...(prevData?.favorite_subjects || []),
  ]);

  const [academicInterests, setAcademicInterests] = useState<string[]>([
    ...(prevData?.academic_interests || []),
  ]);
  const [educationHistory, setEducationHistory] = useState(
    prevData?.education_history || []
  );

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
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const additionalData = {
      ...data,
      academic_achievements: academicAchievements,
      favorite_subjects: favoriteSubjects,
      academic_interests: academicInterests,
      education_history: educationHistory,
    };
    try {
      const parsed = EducationBackgroundSchema.parse(additionalData);
      dispatch({
        type: "UPDATE_EDUCATION_BACKGROUND",
        payload: parsed,
      });
      setErrors(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  const addEducationHistory = (e: React.FormEvent<HTMLDialogElement>) => {
    e.preventDefault();
    setEducationHistoryErrors(undefined);
    const form = e.currentTarget.firstElementChild as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const parsed = EducationHistoryItemSchema.parse(data);
      setEducationHistory((prev) => [...prev, parsed]);
      closeDialogCenterToBottom(e.currentTarget);
      form.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEducationHistoryErrors(error.flatten().fieldErrors);
      }
    }
  };

  return (
    <>
      <form
        ref={root}
        onSubmit={handleSubmit}
        className=" bg-fuchsia-400  w-full h-screen flex flex-col items-center overflow-hidden text-black"
      >
        <Heading
          as="h1"
          size={"xxl"}
          variant={"glass"}
          className={ANIMEJS_ANIMATION_CLASSES.WORDS_ANIMATIONS.SLIDE_DOWN}
        >
          Education Background
        </Heading>

        {/* main */}
        <div
          className={
            ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
            " thin-scrollbar flex flex-col gap-2 justify-between items-start text-white w-[90%] max-w-[600px] h-full bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
          }
        >
          <div className="w-full">
            <div className="flex gap-1">
              <div className="w-1/2">
                <Label htmlFor="highest_degree">Highest Degree</Label>
                <Input
                  id="highest_degree"
                  name="highest_degree"
                  variant={"glass"}
                  error={!!errors?.highest_degree}
                  defaultValue={prevData?.highest_degree}
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  name="field_of_study"
                  variant={"glass"}
                  error={!!errors?.field_of_study}
                  defaultValue={prevData?.field_of_study}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="institution_name"
                fieldInfo={EDUCATION_FIELD_INFO.institution_name}
              >
                Institution Name
              </Label>
              <Input
                id="institution_name"
                name="institution_name"
                defaultValue={prevData?.institution_name}
                variant={"glass"}
                error={!!errors?.institution_name}
              />
            </div>

            <div className=" flex gap-1">
              <div className="w-1/2">
                {" "}
                <Label
                  htmlFor="graduation_year"
                  fieldInfo={EDUCATION_FIELD_INFO.graduation_year}
                >
                  Graduation Year
                </Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  defaultValue={prevData?.graduation_year}
                  variant={"glass"}
                  error={!!errors?.graduation_year}
                  min={1900}
                />
              </div>
              <div className="w-1/2">
                <Label
                  htmlFor="gpa_or_grade"
                  fieldInfo={EDUCATION_FIELD_INFO.gpa_or_grade}
                >
                  GPA or Grade
                </Label>
                <Input
                  id="gpa_or_grade"
                  name="gpa_or_grade"
                  defaultValue={prevData?.gpa_or_grade}
                  variant={"glass"}
                  error={!!errors?.gpa_or_grade}
                />
              </div>
            </div>

            <Label
              htmlFor="academic_achievements"
              fieldInfo={EDUCATION_FIELD_INFO.academic_achievements}
            >
              Academic Achievements
            </Label>
            <MultiDataInput
              id="academic_achievements"
              items={academicAchievements}
              setItems={setAcademicAchievements}
            />

            <Label
              htmlFor="favorite_subjects"
              fieldInfo={EDUCATION_FIELD_INFO.favorite_subjects}
            >
              Favorite Subjects
            </Label>
            <MultiDataInput
              id="favorite_subjects"
              items={favoriteSubjects}
              setItems={setFavoriteSubjects}
            />

            <div>
              <Label
                htmlFor="learning_style"
                fieldInfo={EDUCATION_FIELD_INFO.learning_style}
              >
                Learning Style
              </Label>
              <Input
                id="learning_style"
                name="learning_style"
                defaultValue={prevData?.learning_style}
                variant={"glass"}
                error={!!errors?.learning_style}
              />
            </div>

            <Label
              htmlFor="academic_interests"
              fieldInfo={EDUCATION_FIELD_INFO.academic_interests}
            >
              Academic Interests
            </Label>
            <MultiDataInput
              id="academic_interests"
              items={academicInterests}
              setItems={setAcademicInterests}
            />
            {educationHistory.length > 0 && (
              <div className="thin-scrollbar flex gap-1.5 overflow-x-auto mx-2">
                {educationHistory.map((history, index) => (
                  <ObjectPreview
                    key={index}
                    data={history}
                    setData={setEducationHistory}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full space-y-1">
            <Button ref={addEduButtonRef} className=" bg-purple-400">
              Add Education
            </Button>
            <div className="w-full flex gap-1">
              <Button
                icon={"arrowLeft"}
                onClick={() => goto("personality-and-beliefs")}
              >
                Previous
              </Button>
              <Button type="submit" icon={"arrowRight"}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Dialog
        onSubmit={addEducationHistory}
        trigger={addEduButtonRef}
        className="w-full max-w-[350px]"
      >
        <form className="w-full text-white">
          <Heading as={"h1"} className="text-center" variant={"glass"}>
            Add Education
          </Heading>
          <div className="flex gap-1">
            <div className="w-1/2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                variant={"glass"}
                error={!!educationHistoryErrors?.degree}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="field">Field</Label>
              <Input
                id="field"
                name="field"
                variant={"glass"}
                error={!!educationHistoryErrors?.field}
              />
            </div>
          </div>
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            name="institution"
            variant={"glass"}
            error={!!educationHistoryErrors?.institution}
          />
          <div className="flex gap-1">
            <div className="w-1/2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={1900}
                variant={"glass"}
                error={!!educationHistoryErrors?.year}
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" name="grade" variant={"glass"} />
            </div>
          </div>
          <Button type="submit" className=" my-1.5">
            Add
          </Button>
        </form>
      </Dialog>
    </>
  );
}

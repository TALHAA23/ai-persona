import { ANIMEJS_ANIMATION_CLASSES } from "@/utils/shared/CONST";
import Heading from "../ui/headings";
import { useEffect, useRef, useState } from "react";
import { createScope, Scope } from "animejs";
import formFieldsShowingUp from "@/animations/form-fields-showing-up";
import { textSlideDown } from "@/animations/text-animations";
import formSlideUp from "@/animations/formSlideUp";
import { PersonaCreationFormProps } from "@/types/types.client";
import DragDrop from "../ui/drag-and-drop";
import Input from "../ui/input";
import Label from "../ui/label";
import { useFormSections } from "@/hooks/use-form-sections";
import MultiDataInput from "../ui/multi-data-input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import z from "zod";
import { CategoriesEnum, ContentTypeEnum, ImportanceEnum } from "@/types/enums";
import TextArea from "../ui/textarea";
import { capitalize } from "@/utils/frontend";
import Checkbox from "../ui/checkbox";
import {
  FileUploadMetaDataItemSchema,
  ClientFileUploadsSchema,
} from "@/types/schemas.client";
import Button from "../ui/button";
import useFormNavigator from "@/hooks/use-form-navigator";
import ObjectPreview from "../ui/object-preview";

const FILE_FIELD_INFO = {
  category:
    "The main category this file belongs to. Helps organize your content.",
  content_type:
    "What type of content this file contains. Examples: Text, Image, Document.",
  topics: "Main topics or themes covered in this file.",
  keywords: "Important keywords that describe the file content.",
  tags: "Labels to help categorize and find this file later.",
  time_period:
    "When this content is relevant or was created. Examples: 2023, College Years, Childhood.",
  importance:
    "How important this file is for your persona. High importance content is surfaced more often.",
  confidence_level: "How confident you are about this information (0-1 scale).",
  title: "A descriptive title for this file.",
  description:
    "A brief description of what this file contains and why it's important.",
  context_notes: "Additional context or notes about this file.",
  relevance_scope:
    "When should this information be surfaced? Examples: Work discussions, Personal conversations.",
  audience_tags:
    "Who should see this information? Examples: Professional contacts, Friends, Family.",
};

export default function FileUploads({
  prev,
  skippable,
  next,
}: PersonaCreationFormProps) {
  const goto = useFormNavigator();
  const { dispatch, state } = useFormSections();
  const scope = useRef<Scope>(null);
  const scopeForForm = useRef<Scope>(null);
  const root = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [fileUploads, setFileUploads] = useState<
    z.infer<typeof ClientFileUploadsSchema>
  >({ file_uploads_metadata: [] });
  const [metadataErrors, setMetadataErrors] =
    useState<z.inferFlattenedErrors<typeof FileUploadMetaDataItemSchema>>();

  const [formState, setFormState] = useState({
    topics: [] as string[],
    keywords: [] as string[],
    tags: [] as string[],
    relevanceScope: [] as string[],
    audienceTags: [] as string[],
    category: "",
    contentType: "",
    importance: "",
  });

  // Helper function to update form state
  const updateFormState = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to reset form state
  const resetFormState = () => {
    setFormState({
      topics: [],
      keywords: [],
      tags: [],
      relevanceScope: [],
      audienceTags: [],
      category: "",
      contentType: "",
      importance: "",
    });
  };

  useEffect(() => {
    if (!root.current) return;
    scope.current = createScope({ root }).add(() => {
      formSlideUp();
      textSlideDown();
    });

    return () => scope.current?.revert();
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    scopeForForm.current = createScope({ root }).add(() => {
      formFieldsShowingUp(0);
    });
    return () => scopeForForm.current?.revert();
  }, [selectedFile]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const additionalData = {
      ...data,
      source_type: "file",
      source_id: selectedFile?.name || "",
      persona_id: state.personaConfigs?.persona_name || "",
      category: formState.category,
      content_type: formState.contentType,
      importance: formState.importance,
      topics: formState.topics,
      keywords: formState.keywords,
      tags: formState.tags,
      temporal_context: {
        time_period: data.time_period as string,
        is_current: data.is_current,
        is_historical: data.is_historical,
        valid_from: data.valid_from
          ? new Date(data.valid_from as string)
          : undefined,
        valid_until: data.valid_until
          ? new Date(data.valid_until as string)
          : undefined,
      },
      confidence_level: parseFloat(data.confidence_level as string) || 1,
      relevance_scope:
        formState.relevanceScope.length > 0
          ? formState.relevanceScope
          : undefined,
      audience_tags:
        formState.audienceTags.length > 0 ? formState.audienceTags : undefined,
    };

    try {
      const fileParsed = ClientFileUploadsSchema.shape.file_uploads.parse([
        selectedFile,
      ]);
      const parsed = FileUploadMetaDataItemSchema.parse(additionalData);
      // setMetadata((prev) => [...prev, parsed]);
      if (fileParsed)
        setFileUploads((prev) => ({
          file_uploads: [...(prev?.file_uploads || []), ...fileParsed],
          file_uploads_metadata: [...prev?.file_uploads_metadata, parsed],
        }));
      setMetadataErrors(undefined);
      setSelectedFile(undefined);
      resetFormState();
      e.currentTarget.reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMetadataErrors(error.flatten());
      }
    }
  };

  const onNext = () => {
    dispatch({ type: "UPDATE_FILES", payload: fileUploads });
    if (next) goto(next);
  };

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
        Upload Your Files
      </Heading>
      {/* form */}
      <div
        className={
          ANIMEJS_ANIMATION_CLASSES.CONTAINERS_ANIMATION.SLIDE_UP +
          " h-full flex flex-col justify-between items-start text-white w-[90%] max-w-[600px]  bottom-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-t-2xl overflow-y-auto p-3 shadow-2xl"
        }
      >
        <div className="w-full">
          {!!metadataErrors?.formErrors.length && (
            <Heading as={"p"} asError={true}>
              {metadataErrors.formErrors[0]}
            </Heading>
          )}
          <DragDrop
            variant="glass"
            accept=".md, .txt, text/markdown, text/plain"
            maxSize={5 * 1024 * 1024} // 5MB
            selectedFile={selectedFile}
            onFileSelected={(file) => setSelectedFile(file)}
          />

          {selectedFile && (
            <form onSubmit={handleSubmit} className="w-full space-y-4 my-1">
              {/* Basic Information */}

              <div>
                <Label htmlFor="title" fieldInfo={FILE_FIELD_INFO.title}>
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  variant={"glass"}
                  error={!!metadataErrors?.fieldErrors.title}
                  defaultValue={selectedFile.name}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  variant={"glass"}
                  error={!!metadataErrors?.fieldErrors.description}
                />
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onChange={(value) => updateFormState("category", value)}
                  value={formState.category}
                >
                  <SelectTrigger
                    placeholder="Select Category"
                    variants={"glass"}
                    error={!!metadataErrors?.fieldErrors.category}
                  />
                  <SelectContent>
                    {CategoriesEnum.options.map((item) => (
                      <SelectItem key={item} value={item}>
                        {capitalize(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Type */}
              <div>
                <Label htmlFor="content_type">Content Type</Label>
                <Select
                  onChange={(value) => updateFormState("contentType", value)}
                  value={formState.contentType}
                >
                  <SelectTrigger
                    placeholder="Select Content Type"
                    variants={"glass"}
                    error={!!metadataErrors?.fieldErrors.content_type}
                  />
                  <SelectContent>
                    {ContentTypeEnum.options.map((item) => (
                      <SelectItem key={item} value={item}>
                        {capitalize(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Multi-input Fields */}
              <div>
                <Label htmlFor="topics" fieldInfo={FILE_FIELD_INFO.topics}>
                  Topics
                </Label>
                <MultiDataInput
                  id="topics"
                  items={formState.topics}
                  setItems={(items) => updateFormState("topics", items)}
                />
              </div>

              <div>
                <Label htmlFor="keywords" fieldInfo={FILE_FIELD_INFO.keywords}>
                  Keywords
                </Label>
                <MultiDataInput
                  id="keywords"
                  items={formState.keywords}
                  setItems={(items) => updateFormState("keywords", items)}
                />
              </div>

              <div>
                <Label htmlFor="tags" fieldInfo={FILE_FIELD_INFO.tags}>
                  Tags
                </Label>
                <MultiDataInput
                  id="tags"
                  items={formState.tags}
                  setItems={(items) => updateFormState("tags", items)}
                />
              </div>

              {/* Importance */}
              <div>
                <Label
                  htmlFor="importance"
                  fieldInfo={FILE_FIELD_INFO.importance}
                >
                  Importance
                </Label>
                <Select
                  onChange={(value) => updateFormState("importance", value)}
                  value={formState.importance}
                >
                  <SelectTrigger
                    placeholder="Select Importance"
                    variants={"glass"}
                    error={!!metadataErrors?.fieldErrors.importance}
                  />
                  <SelectContent>
                    {ImportanceEnum.options.map((item) => (
                      <SelectItem key={item} value={item}>
                        {capitalize(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Confidence Level */}
              <div>
                <Label
                  htmlFor="confidence_level"
                  fieldInfo={FILE_FIELD_INFO.confidence_level}
                >
                  Confidence Level
                </Label>
                <Input
                  id="confidence_level"
                  name="confidence_level"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="1"
                  variant={"glass"}
                  error={!!metadataErrors?.fieldErrors.confidence_level}
                />
              </div>

              {/* Temporal Context */}
              <div>
                <Label
                  htmlFor="time_period"
                  fieldInfo={FILE_FIELD_INFO.time_period}
                >
                  Time Period
                </Label>
                <Input
                  id="time_period"
                  name="time_period"
                  variant={"glass"}
                  error={!!metadataErrors?.fieldErrors.temporal_context}
                />
              </div>

              <div className="flex gap-4">
                <Checkbox
                  label="Is Current"
                  id="is_current"
                  name="is_current"
                  defaultChecked={true}
                />
                <Checkbox
                  label="Is Historical"
                  id="is_historical"
                  name="is_historical"
                />
              </div>

              {/* Optional Fields */}
              <div>
                <Label
                  htmlFor="context_notes"
                  fieldInfo={FILE_FIELD_INFO.context_notes}
                >
                  Context Notes
                </Label>
                <TextArea
                  id="context_notes"
                  name="context_notes"
                  variant={"glass"}
                />
              </div>

              <div>
                <Label
                  htmlFor="relevance_scope"
                  fieldInfo={FILE_FIELD_INFO.relevance_scope}
                >
                  Relevance Scope
                </Label>
                <MultiDataInput
                  id="relevance_scope"
                  items={formState.relevanceScope}
                  setItems={(items) => updateFormState("relevanceScope", items)}
                />
              </div>

              <div>
                <Label
                  htmlFor="audience_tags"
                  fieldInfo={FILE_FIELD_INFO.audience_tags}
                >
                  Audience Tags
                </Label>
                <MultiDataInput
                  id="audience_tags"
                  items={formState.audienceTags}
                  setItems={(items) => updateFormState("audienceTags", items)}
                />
              </div>

              {/* Action Buttons */}
              <Button type="submit" className=" w-fit bg-emerald-600 px-10">
                Add My File
              </Button>
            </form>
          )}
          {fileUploads?.file_uploads_metadata?.length > 0 && (
            <div className="thin-scrollbar overflow-x-auto flex gap-2 px-3.5">
              {fileUploads?.file_uploads_metadata.map((item, index) => (
                <ObjectPreview
                  key={index}
                  data={{ title: item.title, desc: item.description }}
                  updateData={() =>
                    setFileUploads((prev) => {
                      const newUploads =
                        prev?.file_uploads?.filter((_, i) => i !== index) ?? [];
                      const newMetadata =
                        prev?.file_uploads_metadata?.filter(
                          (_, i) => i !== index
                        ) ?? [];

                      return {
                        file_uploads: newUploads,
                        file_uploads_metadata: newMetadata,
                      };
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div
          className={
            ANIMEJS_ANIMATION_CLASSES.FORM_FIELD_SHOWING + " w-full space-y-1"
          }
        >
          {skippable && (
            <Button
              onClick={() => next && goto(next)}
              className=" bg-gradient-to-l from-yellow-400 via-yellow-500 to-yellow-600"
            >
              Skip & Continue
            </Button>
          )}
          <div className=" flex gap-1 w-full">
            {prev && (
              <Button icon={"arrowLeft"} onClick={() => goto(prev)}>
                Previous
              </Button>
            )}
            <Button onClick={onNext} icon={"arrowRight"}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

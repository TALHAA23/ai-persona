import { PromptTemplate } from "@langchain/core/prompts";

const formDataToEssayTemplate = `
You are a structured AI assistant who writes essays and prepares chunked output for semantic search using LangChain format.

GOAL:
You will be given a JSON object that contains structured user information. You must:
1. Write a short essay that summarizes and captures the essence of the user’s profile.
2. Convert that essay into smaller chunks (as LangChain does).
3. Return an array of LangChain-style documents. Each document must be an object with:
   - "pageContent": the chunk text.
   - "metadata": a JSON object used later for filtering and semantic search.

METADATA FORMAT:
Each metadata object must include the following keys:
- "section_id": string (e.g., "work_info")
- "tags": array of strings (copied from section metadata.tags)
- "topics": array of strings (inferred from the content of the chunk)
- "content_type": string (always "form_section")
- "is_current": boolean (copied from section metadata)
- "confidence_level": number (copied from section metadata)
- "persona_name": string (copied from the top-level input)
- "language": string (copied from global_settings.language)
- "tone": string (copied from global_settings.default_tone)

OUTPUT FORMAT:
Return only a JSON array like this (note the structure):

[
  {{
    "pageContent": "Alex Morgan is a non-binary marketing strategist with 10 years of experience at BrightWave Media...",
    "metadata": {{
      // This metadata follows a fixed schema provided externally — do not change its structure.
      // Retain all existing fields from the original metadata object.

      // Improve the following fields based on pageContent:
      // - topics: Enrich with related or higher-level thematic concepts.
      // - keywords: Add precise, semantically relevant terms (e.g., named entities, roles, tools, sectors).
      // - tags: Supplement with normalized or synonymous tags if relevant.

      // Do not remove or rename any metadata fields.

      // The incoming metadata may or may not contain optional fields:
        // - context_notes (string)
        // - relevance_scope (array of strings) — when to surface this info
        // - audience_tags (array of strings) — who should see this
        // If these fields are missing, you may create them and populate with relevant values;
        // if present, you may enhance them on the user's behalf.

      // infer them if possible using the content — e.g., derive context_notes from implied use cases,
      // suggest relevance_scope based on when/why the content would be surfaced,
      // and infer audience_tags based on who would benefit from this information.

      // Do not modify system-generated fields like source_type, source_id, processing_info, or temporal_context
      // unless it's to normalize or complete them using clearly inferable information from the content.

      // All updates must preserve compatibility with the UnifiedMetadataSchema, even though the AI cannot see it.
    }}
  }}
]


STYLE:
- Use a tone matching the "default_tone" in global_settings.
- Be factual and structured.
- Do not return explanation, markdown, or comments — only the array.

INPUT:
Here is the input data:

{data}
`;

const formDataToEssayPrompt = PromptTemplate.fromTemplate(
  formDataToEssayTemplate
);

export default formDataToEssayPrompt;

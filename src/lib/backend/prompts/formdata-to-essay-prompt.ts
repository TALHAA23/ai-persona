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
      "section_id": "work_info",
      "tags": ["career", "skills", "education"],
      "topics": ["marketing", "career", "education"],
      "content_type": "form_section",
      "is_current": true,
      "confidence_level": 0.95,
      "persona_name": "Alex Morgan",
      "language": "en",
      "tone": "friendly"
    }}
  }},
  ...
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

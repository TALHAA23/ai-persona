// ? MOVED TO ZOD
// import { Document } from "langchain/document";

// export interface ChatMessage {
//   role: "user" | "model";
//   content: string;
// }

// type Categories = "work" | "hobbies" | "personal";

// export interface ChunkMetadata {
//   persona_id: string;
//   section_id: string;
//   file_id: string;
//   category: Categories;
// }

// export interface ChunkDocument extends Document {
//   metadata: ChunkMetadata;
// }

// export interface PersonaCreationInput {
//   user_id: string;
//   persona_name: string;
//   persona_description?: string;

//   // Form-based structured data
//   form_sections: FormSection[];

//   // File uploads with metadata
//   file_uploads: FileUpload[];

//   // Global persona settings
//   global_settings: {
//     default_tone?: PersonaTone;
//     default_persona_type?: PersonaType;
//     privacy_level?: "public" | "private" | "selective";
//     language?: string;
//   };
// }

// export interface FormSection {
//   section_id: string; // e.g., 'personal_info', 'work', 'hobbies'
//   section_name: string; // Display name
//   is_completed: boolean; // Did user fill this section?
//   data: Record<string, any>; // The actual form data
//   metadata: {
//     confidence_level?: number;
//     is_current?: boolean;
//     last_updated?: Date;
//     tags?: string[];
//   };
// }

// export interface FileUpload {
//   file_id: string;
//   original_filename: string;
//   file_size: number;
//   mime_type: string;
//   file_url: string; // Where the file is stored

//   // User-provided metadata about the file
//   user_metadata: {
//     title: string; // User's title for the file
//     description: string; // What does this file contain?
//     content_type: ContentType; // narrative, factual, opinion, etc.
//     topics: string[]; // What topics does this cover?
//     keywords: string[]; // Important keywords
//     time_period?: string; // When is this from/about?
//     importance: "low" | "medium" | "high";
//     tags: string[]; // Free-form tags
//     context_notes?: string; // Additional context from user
//   };

//   // Processing status
//   processing_status: "pending" | "processing" | "completed" | "failed";
//   extracted_content?: string; // Processed file content
//   processing_metadata?: {
//     chunk_count?: number;
//     entities_extracted?: string[];
//     auto_generated_tags?: string[];
//     sentiment_score?: number;
//   };
// }

// export interface FileMetadataInput {
//   file_id: string;
//   persona_id: string;

//   // Required user inputs
//   title: string;
//   description: string;

//   // Guided metadata collection
//   content_classification: {
//     primary_type: ContentType;
//     secondary_types?: ContentType[];
//     confidence: number; // How sure is the user about this classification?
//   };

//   // Topic and keyword extraction
//   topics: TopicInput[];
//   keywords: string[];

//   // Temporal context
//   temporal_info: {
//     time_period?: string; // "college years", "current job", "childhood"
//     specific_dates?: {
//       from?: Date;
//       to?: Date;
//     };
//     is_current: boolean;
//     is_historical: boolean;
//   };

//   // Usage context
//   usage_context: {
//     when_to_use: string[]; // When should this info be surfaced?
//     importance_level: "low" | "medium" | "high";
//     privacy_level: "public" | "private" | "selective";
//     audience_tags?: string[]; // Who should see this info?
//   };

//   // Free-form metadata
//   custom_tags: string[];
//   notes?: string;
// }

// export interface TopicInput {
//   topic: string;
//   relevance: number; // 0-1, how relevant is this topic to the file?
//   subtopics?: string[];
// }

// export interface QueryAnalysisInput {
//   user_message: string;
//   persona_id: string;
//   conversation_context?: {
//     previous_messages?: string[];
//     conversation_topic?: string;
//     user_intent?: string;
//   };
// }

// export interface QueryAnalysisOutput {
//   analysis_id: string;
//   timestamp: Date;

//   // What the query is about
//   query_intent: {
//     primary_intent: QueryIntent;
//     secondary_intents?: QueryIntent[];
//     confidence: number;
//   };

//   // What information is needed to answer
//   required_information: {
//     required_topics: string[];
//     required_tags: string[];
//     required_content_types: ContentType[];
//     temporal_requirements?: {
//       prefer_current: boolean;
//       prefer_historical: boolean;
//       specific_time_period?: string;
//     };
//     importance_threshold?: "low" | "medium" | "high";
//   };

//   // Search parameters for semantic search
//   search_parameters: {
//     query_embeddings?: number[]; // If you're doing semantic search
//     search_keywords: string[];
//     filter_criteria: {
//       topics?: string[];
//       tags?: string[];
//       content_types?: ContentType[];
//       date_range?: {
//         from?: Date;
//         to?: Date;
//       };
//       min_importance?: "low" | "medium" | "high";
//     };
//     result_limit?: number;
//   };

//   // Response guidance
//   response_style: {
//     recommended_tone: PersonaTone;
//     recommended_length: "short" | "medium" | "long";
//     should_include_examples: boolean;
//     should_include_personal_touch: boolean;
//   };
// }

// type QueryIntent =
//   | "personal_info" // About personal life, background
//   | "work_experience" // Professional/career questions
//   | "skills_expertise" // What they know/can do
//   | "opinions_beliefs" // Their thoughts/opinions
//   | "experiences_stories" // Past experiences, stories
//   | "current_status" // What they're doing now
//   | "goals_aspirations" // Future plans, goals
//   | "relationships" // Family, friends, connections
//   | "hobbies_interests" // Personal interests
//   | "advice_guidance" // Asking for their advice
//   | "general_chat"; // Casual conversation

// type ContentType =
//   | "narrative" // Stories, experiences
//   | "factual" // Skills, achievements, dates
//   | "opinion" // Beliefs, preferences
//   | "instruction" // How-to knowledge
//   | "reference" // Lists, contacts
//   | "mixed";

// type PersonaTone =
//   | "formal"
//   | "casual"
//   | "friendly"
//   | "professional"
//   | "humorous"
//   | "empathetic"
//   | "conversational"
//   | "adaptive";

// type PersonaType =
//   | "mentor"
//   | "friend"
//   | "professional"
//   | "teacher"
//   | "advisor"
//   | "storyteller"
//   | "creative"
//   | "adaptive";

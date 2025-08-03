export const AI_CHATBOT_FIELD_INFO = {
  persona_type:
    "Defines how your chatbot should behave. Adaptive = changes with context, Static = consistent tone, Contextual = based on situation.",
  response_tone:
    "The primary tone your chatbot should use. Examples: Friendly, professional, playful.",
  formality_level:
    "Controls the chatbot's sentence structure and word choice. Casual = relaxed, Formal = polite and professional.",
  allowed_topics:
    "Subjects the chatbot is allowed to discuss on your behalf. Examples: Tech, Personal Growth, Travel.",
  disallowed_topics:
    "Topics you want the chatbot to avoid completely. Examples: Politics, Religion, Mental Health.",

  signature_phrases:
    "Catchphrases or expressions the chatbot can use. Adds personality. Examples: 'Let's go!', 'That’s a win!'",
  preferred_length: "Typical response size you'd prefer from the chatbot.",
  reply_style_examples:
    "Example pairs of how you’d like your chatbot to respond to specific messages.",
  emoji_usage: "How often your chatbot should use emojis in responses.",
  name_as_referred_to:
    "How the chatbot should address *you*. E.g., 'Sir', 'Talha', 'Captain'.",
};

export default function ChatbotPreference() {
  return <h1>Work required</h1>;
}

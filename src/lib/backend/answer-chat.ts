import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import standaloneQuestionPrompt from "./prompts/standalonePrompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { supabaseVectoreRetriever } from "./vector-retriever";
import { combineDocs } from "@/utils/backend";
import answerPrompt from "./prompts/answer-prompt";
import { RunnableSequence } from "@langchain/core/runnables";
import z from "zod";
import { ChatMessageSchema } from "@/types/schemas";

const history: z.infer<typeof ChatMessageSchema>[] = [];

export default async function answerChat(message: string) {
  history.push({
    role: "user",
    content: message,
  });
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.NEXT_GOOGLE_GEN_AI_API,
    model: "gemini-2.0-flash",
  });

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser())
    .pipe(supabaseVectoreRetriever)
    .pipe(combineDocs);

  const answerChain = RunnableSequence.from([
    ({ context }) => ({ context, chats_messages: history }),
    // (prev) => console.log(prev),
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const chain = RunnableSequence.from([
    {
      context: standaloneQuestionChain,
    },
    answerChain,
  ]);

  const result = await chain.invoke({ chats_messages: history });

  history.push({
    role: "model",
    content: result,
  });

  return result;
}

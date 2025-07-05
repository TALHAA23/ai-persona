import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import standaloneQuestionPrompt from "./prompts/standalonePrompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { supabaseVectoreRetriever } from "./vector-retriever";
import { combineDocs } from "@/utils/backend";
import answerPrompt from "./prompts/answer-prompt";
import { RunnableSequence } from "@langchain/core/runnables";

export default async function answerChat(message: string) {
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
    ({ context }) => ({ context, message }),
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

  const result = await chain.invoke({ message });

  return result;
}

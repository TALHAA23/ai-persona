import { Document } from "langchain/document";
export const combineDocs = (docs: Document[]) =>
  docs.map((doc) => doc.pageContent).join("\n");

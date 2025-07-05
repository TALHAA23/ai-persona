import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import path from "node:path";
import createChunks from "@/lib/backend/create-chunks";
import embedAndInsert from "@/lib/backend/embedd-and-insert";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "bio.md");
    const userFile = await fs.readFile(filePath, { encoding: "utf-8" });
    const docs = await createChunks(userFile);
    await embedAndInsert(docs);
    return NextResponse.json({ message: "Successfully Inserted!" });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
        statusText: "internal_server_error",
      }
    );
  }
}

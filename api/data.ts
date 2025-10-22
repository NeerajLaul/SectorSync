import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src", "api", "questions.json");
  const data = await fs.readFile(filePath, "utf-8");
  return new Response(data, {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const filePath = path.join(process.cwd(),"src", "api", "questions.json");
  const newData = await req.json();
  await fs.writeFile(filePath, JSON.stringify(newData, null, 2));
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

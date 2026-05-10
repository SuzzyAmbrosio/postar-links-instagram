import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "templates", "story");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const images = fs
    .readdirSync(dir)
    .filter((file) =>
      [".png", ".jpg", ".jpeg", ".webp"].includes(path.extname(file).toLowerCase())
    )
    .map((file) => ({
      name: file,
      url: `/templates/story/${file}`,
    }));

  return NextResponse.json({ images });
}
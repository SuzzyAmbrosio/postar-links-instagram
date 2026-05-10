import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "templates");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const files = fs
    .readdirSync(uploadDir)
    .filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(path.extname(file).toLowerCase())
    )
    .map((file) => ({
      name: file,
      url: `/uploads/templates/${file}`,
      source: "local",
    }));

  return NextResponse.json({ templates: files });
}
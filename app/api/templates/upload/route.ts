import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato inválido. Use JPG, PNG ou WEBP." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".png";
  const fileName = `${nanoid(10)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "templates");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    name: fileName,
    url: `/uploads/templates/${fileName}`,
    source: "local",
  });
}
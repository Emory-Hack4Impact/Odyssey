import { NextResponse } from "next/server";
import { uploadDocumentCore } from "./index";

export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // read data from request and pull out fields
    const formData = await req.formData();

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const userId = formData.get("userId") as string | null;
    const bucket = formData.get("bucket") as string | null;

    if (!userId || !bucket) {
      return NextResponse.json({ error: "userId and bucket are required" }, { status: 400 });
    }

    const viewersRaw = formData.get("viewers") as string | null;
    const folderPathRaw = formData.get("folderPath") as string | null;

    const viewers: string[] = viewersRaw ? JSON.parse(viewersRaw) : [];
    const folderPath: string[] = folderPathRaw ? JSON.parse(folderPathRaw) : [];

    // mime type
    const contentType = file.type ?? (formData.get("contentType") as string | null) ?? undefined;

    // turn file in ArrayBuffer
    const fileBody = await file.arrayBuffer();

    // server helper to update Prisma & Supabase
    const result = await uploadDocumentCore({
      userId,
      fileName: file.name,
      viewers,
      folderPath,
      bucket,
      contentType,
      fileBody,
    });

    // send json back to client side
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/documents POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

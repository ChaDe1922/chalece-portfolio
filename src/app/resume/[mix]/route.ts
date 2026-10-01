import { ALL_MIX_KEYS, parseMixKey } from "@/data/resume-mix";
import { renderResume } from "@/lib/resume-pdf";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { mix: string }[] {
  return ALL_MIX_KEYS.map((mix) => ({ mix }));
}

export async function GET(_request: Request, { params }: RouteContext<"/resume/[mix]">): Promise<Response> {
  const { mix } = await params;
  const parts = parseMixKey(mix);
  if (!parts) return new Response("Not found", { status: 404 });
  const { bytes } = await renderResume(parts);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Chalece-DeLaCoudray-Resume.pdf"',
    },
  });
}

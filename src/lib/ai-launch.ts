import { copyText } from "@/lib/clipboard";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const TOOLS = vibeCodingLab.aiPanel.tools;
export type ToolId = (typeof TOOLS)[number]["id"];

/** Open a free AI tool in a new tab, pre-filling the prompt where the tool
 *  supports it. The prompt is also copied to the clipboard, because the `?q=`
 *  hint does not always survive a logged-out sign-in flow, so the learner can
 *  always paste it. Tools without a query URL just open. */
export async function launchPrompt(toolId: ToolId, prompt?: string): Promise<void> {
  const tool = TOOLS.find((t) => t.id === toolId) ?? TOOLS[0];
  const trimmed = prompt?.trim();
  let url: string = tool.url;
  if (trimmed && tool.query) {
    url = tool.query + encodeURIComponent(trimmed);
    await copyText(trimmed);
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

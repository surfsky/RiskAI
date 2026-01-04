"use server";

import { qwenManager } from "@/lib/ai/QwenManager";

/**
 * Server action to analyze image
 */
export async function analyzeImageAction(imgBase64: string, prompt?: string) {
  return await qwenManager.analyzeImage(imgBase64, prompt);
}

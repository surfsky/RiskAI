import OpenAI, { APIError } from "openai";

/**
 * AI Manager for interacting with Qwen-VL (via OpenAI Compatible API)
 */
export class QwenManager {
  private _client: OpenAI;

  constructor() {
    this._client = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY || "",
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      dangerouslyAllowBrowser: true // Only if used in client-side (we use it in server action, so this is safe/ignored)
    });
  }

  /**
   * Analyze image for hazards
   * @param imgBase64 Image data in base64 (must include prefix like data:image/jpeg;base64,...)
   * @param prompt User prompt or system instruction
   */
  async analyzeImage(imgBase64: string, prompt: string = "请分析图片中的安全隐患"): Promise<string> {
    if (!process.env.DASHSCOPE_API_KEY) {
      console.warn("No API Key found. Returning mock response.");
      return this._mockResponse();
    }

    try {
      const response = await this._client.chat.completions.create({
        model: "qwen-vl-max",
        messages: [
          {
            role: "system",
            content: "你是一个安全隐患识别专家。"
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  "url": imgBase64
                }
              }
            ]
          }
        ]
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return content;
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (error: unknown) {
      console.error("AI Analysis Failed:", error);
      
      if (error instanceof APIError) {
         return `AI 服务报错: ${error.message} (Code: ${error.code})`;
      }
      
      if (error instanceof Error) {
        return `系统错误: ${error.message}`;
      }

      return "AI 服务暂时不可用，请检查网络或 API Key。";
    }
  }

  /**
   * Mock response for testing
   */
  private _mockResponse(): string {
    return `[模拟 AI 回复] 
1. 发现工人未佩戴安全帽。
2. 梯子放置不稳，存在跌落风险。
3. 地面有积水，可能导致滑倒。
建议立即整改。`;
  }
}

export const qwenManager = new QwenManager();

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { analyzeImageAction } from "@/app/actions";
import { trainingManager } from "@/lib/db/TrainingDB";

export default function ScanPage() {
  const [imgData, setImgData] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Analyze with "Knowledge Base" context
   */
  const handleImageSelect = async (base64: string) => {
    setImgData(base64);
    if (!base64) {
      setResult("");
      return;
    }

    setIsAnalyzing(true);
    try {
      // 1. Retrieve recent expert knowledge (Simple RAG simulation)
      const records = await trainingManager.getRecords();
      // Take last 3 examples as context
      const examples = records.slice(0, 3).map((r, i) => 
        `案例 ${i+1}: ${r.expertCorrection.slice(0, 100)}...`
      ).join("\n");

      const prompt = `
你是一名安全检查员。请分析这张图片中的安全隐患。
参考以下专家历史经验：
${examples || "暂无历史经验，请根据通用安全标准判断。"}

请列出：
1. 存在的具体隐患
2. 整改建议
`;

      // 2. Call AI
      const aiResponse = await analyzeImageAction(base64, prompt);
      setResult(aiResponse);

    } catch (e) {
      console.error(e);
      setResult("分析服务暂时不可用。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm flex items-center sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 text-slate-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold ml-2">隐患排查 (用户模式)</h1>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Upload Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">现场拍照</h2>
          <ImageUploader onImageSelect={handleImageSelect} />
        </section>

        {/* Result Section */}
        {imgData && (
          <section className="bg-white p-4 rounded-xl shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <AlertTriangle className="text-orange-500 mr-2" size={20} />
                分析结果
              </h2>
              {isAnalyzing && (
                <div className="flex items-center text-blue-600 text-sm">
                  <Loader2 size={16} className="animate-spin mr-1" />
                  AI 正在思考...
                </div>
              )}
            </div>

            <div className="prose prose-slate prose-sm w-full">
              {isAnalyzing ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {result || "等待分析..."}
                </div>
              )}
            </div>
            
            {!isAnalyzing && result && (
               <div className="mt-6 p-3 bg-green-50 text-green-700 rounded-lg flex items-start text-sm">
                 <CheckCircle2 size={16} className="mr-2 mt-0.5 shrink-0" />
                 <span>分析基于最新的专家知识库进行校准。</span>
               </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

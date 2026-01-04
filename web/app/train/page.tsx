"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Bot } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { analyzeImageAction } from "@/app/actions";
import { trainingManager } from "@/lib/db/TrainingDB";

export default function TrainingPage() {
  const [imgData, setImgData] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Handle image selection and auto-analyze
   */
  const handleImageSelect = async (base64: string) => {
    setImgData(base64);
    if (base64) {
      setIsAnalyzing(true);
      try {
        // Call Server Action
        const result = await analyzeImageAction(base64, "请详细分析图中的安全隐患，并列出整改建议。");
        setAnalysis(result);
      } catch (e) {
        console.error(e);
        setAnalysis("分析失败，请重试。");
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setAnalysis("");
    }
  };

  /**
   * Save the expert correction
   */
  const handleSave = async () => {
    if (!imgData || !analysis) return;
    
    setIsSaving(true);
    try {
      // Save original analysis as placeholder for 'expertCorrection' for now, 
      // in real app we might want to store both raw AI output and corrected output.
      // Here we assume the user edited the 'analysis' text area, so 'analysis' IS the correction.
      await trainingManager.addRecord(imgData, "AI Initial Output", analysis);
      alert("训练数据已保存！");
      // Optional: Clear or redirect
    } catch (e) {
      alert("保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm flex items-center sticky top-0 z-10">
        <Link href="/" className="p-2 -ml-2 text-slate-600">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold ml-2">模型训练 (专家模式)</h1>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
        {/* Upload Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">1. 上传隐患照片</h2>
          <ImageUploader onImageSelect={handleImageSelect} />
        </section>

        {/* Analysis Section */}
        {imgData && (
          <section className="bg-white p-4 rounded-xl shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">2. 专家校正分析</h2>
              {isAnalyzing && (
                <div className="flex items-center text-blue-600 text-xs">
                  <Loader2 size={14} className="animate-spin mr-1" />
                  AI 分析中...
                </div>
              )}
            </div>
            
            <div className="relative flex-1">
              <textarea
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                placeholder="等待图片上传..."
                className="w-full h-64 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {!analysis && !isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                  <Bot size={24} className="mr-2" />
                  <span>AI 将在此生成初步分析</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || isAnalyzing || !analysis}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  保存到知识库
                </>
              )}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

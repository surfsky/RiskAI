import Link from "next/link";
import { ShieldAlert, BrainCircuit, ScanSearch } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <ShieldAlert size={64} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI 隐患识别系统</h1>
        <p className="text-slate-500">基于国产大模型的智能安全助手</p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        <Link 
          href="/scan"
          className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all active:scale-95"
        >
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
            <ScanSearch size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900">隐患排查</h2>
            <p className="text-sm text-slate-500">拍照上传，AI 自动分析隐患</p>
          </div>
        </Link>

        <Link 
          href="/train"
          className="flex items-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all active:scale-95"
        >
          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
            <BrainCircuit size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-900">模型训练</h2>
            <p className="text-sm text-slate-500">专家校正，优化 AI 知识库</p>
          </div>
        </Link>
      </div>

      <footer className="mt-16 text-xs text-slate-400">
        © 2026 AI Safety Guard
      </footer>
    </main>
  );
}

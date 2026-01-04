# AI 隐患识别系统 (AI Safety Guard)

基于国产大模型（阿里云通义千问-VL）的智能安全隐患识别系统。支持手机端拍照上传，AI 自动分析隐患并给出整改建议。

## 核心功能

1.  **隐患排查 (User Mode)**: 
    *   现场拍照上传。
    *   AI 结合专家知识库进行智能分析。
    *   输出隐患详情及整改建议。
2.  **模型训练 (Expert Mode)**:
    *   专家上传典型隐患图片。
    *   对 AI 的初步判断进行修正（RAG 知识库构建）。
    *   数据存入本地数据库，实时优化后续识别效果。

## 技术栈

*   **框架**: Next.js 14 (App Router) + TypeScript
*   **UI**: Tailwind CSS + Lucide Icons (Mobile First Design)
*   **AI**: 阿里云 Qwen-VL-Max (via OpenAI Compatible API)
*   **Database**: Dexie.js (IndexedDB) for Local Storage

## 快速开始

### 1. 安装依赖

```bash
cd web
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并填入阿里云 API Key：

```bash
# web/.env.local
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 即可使用。建议使用浏览器开发者工具模拟移动端设备 (iPhone SE / 12 Pro) 以获得最佳体验。

## 目录结构

```
web/
├── app/              # Next.js 页面路由
│   ├── scan/         # 用户扫描页
│   └── train/        # 专家训练页
├── components/       # UI 组件
├── lib/
│   ├── ai/           # AI 服务封装 (QwenManager)
│   └── db/           # 数据库操作 (Dexie)
└── ...
```

## License

MIT

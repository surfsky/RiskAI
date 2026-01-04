"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  className?: string;
}

export function ImageUploader({ onImageSelect, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Convert file to base64 with compression
   */
  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("请上传图片文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if too large (Max 1280px for better API performance)
        const MAX_SIZE = 1280;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.8 quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        setPreview(compressedBase64);
        onImageSelect(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  /**
   * Trigger file input click
   */
  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  /**
   * Clear selection
   */
  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        accept="image/*"
        capture="environment" // Mobile camera preference
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <button
          onClick={triggerSelect}
          className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors"
        >
          <Camera size={32} className="mb-2" />
          <span className="text-sm font-medium">点击拍照 / 上传图片</span>
        </button>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";

export default function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const next = files?.[0] ?? null;
    setFile(next);
    setStatus(null);
  }

  function handleAnalyze() {
    setStatus("Muy pronto: el análisis en tiempo real llega con el backend.");
  }

  return (
    <div className="w-full max-w-md">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging
            ? "border-teal bg-teal/5"
            : "border-navy/20 bg-white hover:border-teal/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {file ? (
          <p className="text-sm font-medium text-navy">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-navy">
              Arrastra tu PDF aquí
            </p>
            <p className="text-xs text-navy/60">o haz clic para seleccionar</p>
          </>
        )}
      </div>

      <button
        type="button"
        disabled={!file}
        onClick={handleAnalyze}
        className="mt-4 w-full rounded-md bg-blue px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Analizar mi PAC gratis
      </button>

      {status && <p className="mt-2 text-xs text-navy/60">{status}</p>}
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2 } from "lucide-react";

export default function ResumeUpload({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setError(null);
      setLoading(true);

      try {
        await onUpload(acceptedFiles[0]);
      } catch (err) {
        setError("Failed to upload resume. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [] },
      maxFiles: 1,
      disabled: loading,
    });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
        loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-muted"
      }`}
    >
      <input {...getInputProps()} />

      {loading ? (
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
      ) : (
        <UploadCloud className="mx-auto mb-3 h-6 w-6" />
      )}

      <p className="text-sm">
        {loading
          ? "Uploading resume..."
          : "Drag & drop resume PDF here, or click to upload"}
      </p>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}


"use client";

import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
}

export default function CodeEditor({ value, onChange, language = "javascript" }: CodeEditorProps) {
    return (
        <div className="h-full min-h-[400px] w-full bg-[#1e1e1e] overflow-hidden rounded-b-xl">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16 }
                }}
            />
        </div>
    );
}

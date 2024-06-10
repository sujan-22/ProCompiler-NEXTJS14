// components/CodeEditor.js
"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, setCode }) => {
    return (
        <Editor
            height="50vh"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
        />
    );
};

export default CodeEditor;

"use client";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";
import LanguageSelector from "@/components/LanguageSelector";
import InputOutputSection from "@/components/InputOutputSection";
import axios from "axios";
import { languages } from "@/constants/languages";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [language, setLanguage] = useState(languages[0].value); // Default to the first language
    const [code, setCode] = useState(getDefaultCodeSnippet(languages[0].value)); // Set default code snippet based on the selected language
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        setCode(getDefaultCodeSnippet(language));
    }, [language]);

    const runCode = async () => {
        try {
            const response = await axios.post("/api", {
                language,
                code,
            });
            setOutput(response.data.output);
            console.log(response.data.message);
        } catch (error) {
            console.error("Error running code:", error);
        }
    };

    // Function to get the default code snippet based on the selected language
    function getDefaultCodeSnippet(language) {
        const selectedLanguage = languages.find(
            (option) => option.value === language
        );
        return selectedLanguage ? selectedLanguage.defaultCodeSnippet : "";
    }

    return (
        <MaxWidthWrapper>
            <div className="flex h-14 items-center justify-between border-b border-slate-400 uppercase">
                <Link href="/" className="flex z-40 font-semibold">
                    <h1 className="text-slate-600">Pro </h1>Compiler
                </Link>
            </div>
            <div className="flex mt-4 space-x-4">
                <div className="w-4/5">
                    <div className=" mb-2">
                        <LanguageSelector
                            language={language}
                            setLanguage={setLanguage}
                        />
                    </div>
                    <CodeEditor
                        language={language}
                        code={code}
                        setCode={setCode}
                    />
                </div>
                <div className="w-2/5">
                    <InputOutputSection
                        input={input}
                        setInput={setInput}
                        output={output}
                    />
                    <Button
                        variant="secondary"
                        className=" px-8 mt-2"
                        onClick={runCode}
                    >
                        Run
                    </Button>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}

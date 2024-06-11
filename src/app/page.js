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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [language, setLanguage] = useState(languages[0].value);
    const [code, setCode] = useState(getDefaultCodeSnippet(languages[0].value));
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCode(getDefaultCodeSnippet(language));
    }, [language]);

    const runCode = async () => {
        setLoading(true);
        const selectedLanguage = languages.find(
            (lang) => lang.value === language
        );
        const formData = {
            language_id: selectedLanguage.id,
            source_code: btoa(code),
            stdin: btoa(input),
        };

        const options = {
            method: "POST",
            url: process.env.NEXT_PUBLIC_RAPID_URL,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_HOST,
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
            data: formData,
        };

        try {
            const response = await axios.request(options);
            console.log(response);
            const token = response.data.token;
            checkStatus(token);
        } catch (err) {
            console.log(err);
        }
    };

    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_RAPID_URL}/${token}`,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "X-RapidAPI-Host": process.env.NEXT_PUBLIC_RAPID_HOST,
                "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
            },
        };

        try {
            let response = await axios.request(options);
            let statusId = response.data.status?.id;

            if (statusId === 1 || statusId === 2) {
                setTimeout(() => checkStatus(token), 2000);
            } else {
                setLoading(false);
                setOutput(atob(response.data.stdout || ""));
                toast.success(`Compiled Successfully!`);
            }
        } catch (err) {
            handleError(err);
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
            <ToastContainer />
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
                    <div className=" border rounded-md">
                        <CodeEditor
                            language={language}
                            code={code}
                            setCode={setCode}
                        />
                    </div>
                </div>
                <div className="w-2/5">
                    <div className=" mb-2">
                        <Button
                            variant="outline"
                            className=" px-8"
                            onClick={runCode}
                            disabled={loading}
                        >
                            Run
                        </Button>
                    </div>
                    <InputOutputSection
                        input={input}
                        setInput={setInput}
                        output={output}
                    />
                </div>
            </div>
        </MaxWidthWrapper>
    );
}

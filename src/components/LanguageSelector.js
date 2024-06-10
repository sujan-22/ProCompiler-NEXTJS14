"use client";
import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/constants/languages";
import { Button } from "./ui/button";

export default function LanguageDropdown({ language, setLanguage }) {
    const handleLanguageChange = (value) => {
        setLanguage(value);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Language</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Choose a language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={handleLanguageChange}
                >
                    {languages.map((option) => (
                        <DropdownMenuRadioItem
                            key={option.id}
                            value={option.value}
                        >
                            {option.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

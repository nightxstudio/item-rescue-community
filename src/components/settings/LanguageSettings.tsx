
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Languages } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" }
];

export const LanguageSettings = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    // Apply language settings to the document
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem("language", language);

    // Apply language-specific styles
    document.documentElement.setAttribute("data-language", language);
  }, [language]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const selectedLanguage = languages.find(lang => lang.code === value);
    
    toast.success(`Language updated to ${selectedLanguage?.name}`, {
      description: "The application language has been changed.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Language</h2>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Display Language
            </Label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose your preferred language
            </p>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
};

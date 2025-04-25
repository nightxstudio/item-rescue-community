
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Language } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "ml", name: "മലയാളം (Malayalam)" },
];

export const LanguageSettings = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    toast.success("Language updated", {
      description: "Please refresh the page for changes to take effect.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-3">Language</h2>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base flex items-center gap-2">
              <Language className="w-4 h-4" />
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

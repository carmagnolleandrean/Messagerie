import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeSelector() {
  const [theme, setTheme] = useState("light");
  
  const themes = [
    { id: "light", name: "Clair", color: "bg-white" },
    { id: "dark", name: "Sombre", color: "bg-gray-800" },
    { id: "blue", name: "Bleu", color: "bg-blue-100" },
    { id: "green", name: "Vert", color: "bg-green-100" },
    { id: "purple", name: "Violet", color: "bg-purple-100" }
  ];
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium">Thème de l'application</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <Button
            key={t.id}
            variant={theme === t.id ? "default" : "outline"}
            className={`flex items-center space-x-2 ${theme === t.id ? "" : "border-gray-200"}`}
            onClick={() => setTheme(t.id)}
          >
            <span className={`h-4 w-4 rounded-full ${t.color} border border-gray-300`}></span>
            <span>{t.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

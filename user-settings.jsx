import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UserSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
    fontSize: "medium"
  });
  
  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  return (
    <div className="p-4 space-y-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Paramètres utilisateur</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifications</Label>
          <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="notifications"
              className="absolute w-0 h-0 opacity-0"
              checked={settings.notifications}
              onChange={(e) => handleChange("notifications", e.target.checked)}
            />
            <label
              htmlFor="notifications"
              className={`block w-10 h-6 overflow-hidden rounded-full cursor-pointer ${
                settings.notifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.notifications ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sound">Sons</Label>
          <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="sound"
              className="absolute w-0 h-0 opacity-0"
              checked={settings.sound}
              onChange={(e) => handleChange("sound", e.target.checked)}
            />
            <label
              htmlFor="sound"
              className={`block w-10 h-6 overflow-hidden rounded-full cursor-pointer ${
                settings.sound ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.sound ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Mode sombre</Label>
          <div className="relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="darkMode"
              className="absolute w-0 h-0 opacity-0"
              checked={settings.darkMode}
              onChange={(e) => handleChange("darkMode", e.target.checked)}
            />
            <label
              htmlFor="darkMode"
              className={`block w-10 h-6 overflow-hidden rounded-full cursor-pointer ${
                settings.darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${
                  settings.darkMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fontSize">Taille de police</Label>
          <select
            id="fontSize"
            value={settings.fontSize}
            onChange={(e) => handleChange("fontSize", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="small">Petite</option>
            <option value="medium">Moyenne</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
      
      <Button className="w-full">Enregistrer les paramètres</Button>
    </div>
  );
}

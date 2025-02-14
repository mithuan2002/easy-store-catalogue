import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

interface StyleChange {
  title: string;
  description: string;
  styles: Record<string, any>;
}

export const StoreDesignAssistant = () => {
  const [previewStyles, setPreviewStyles] = useState<Record<string, any>>({
    background: "#ffffff",
    text: "#000000",
    primary: "#2563eb",
    secondary: "#4b5563",
    accent: "#06b6d4"
  });
  const [isCreatingStore, setIsCreatingStore] = useState(false); // Retained from original

  const applyStyles = (styles: Record<string, any>) => {
    const root = document.documentElement;
    Object.entries(styles).forEach(([key, value]) => {
      const cssVar = key.startsWith('--') ? key : `--${key}`;
      root.style.setProperty(cssVar, value);
      if (key === 'background') document.body.style.backgroundColor = value;
      if (key === 'text') document.body.style.color = value;
    });
    setPreviewStyles(styles);
  };

  const handleColorChange = (key: string, value: string) => {
    const newStyles = { ...previewStyles, [key]: value };
    applyStyles(newStyles);
  };

  const presetThemes = {
    modern: {
      background: '#ffffff',
      text: '#1e293b',
      primary: '#2563eb',
      secondary: '#4b5563',
      accent: '#06b6d4'
    },
    dark: {
      background: '#1e293b',
      text: '#f8fafc',
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#22d3ee'
    },
    nature: {
      background: '#f0fdf4',
      text: '#166534',
      primary: '#22c55e',
      secondary: '#15803d',
      accent: '#4ade80'
    }
  };

  const handleThemeSelect = (themeName: keyof typeof presetThemes) => {
    applyStyles(presetThemes[themeName]);
  };

  const handleCreateStore = () => {
    setIsCreatingStore(true);
    try {
      // Dispatch custom event with styles
      const event = new CustomEvent('createStore', { detail: previewStyles });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to trigger store creation:', error);
    } finally {
      setIsCreatingStore(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Card className="w-1/2 p-6 space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-bold">Store Design Assistant</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Themes</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presetThemes).map(([name]) => (
              <Button
                key={name}
                onClick={() => handleThemeSelect(name as keyof typeof presetThemes)}
                variant="outline"
                className="capitalize"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Colors</h3>
          {Object.entries(previewStyles).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">{key} Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id={key}
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-12 h-8 p-0"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Separator orientation="vertical" className="mx-2" />

      <div className="w-1/2 p-6 overflow-y-auto" style={{ 
        backgroundColor: previewStyles.background || '#ffffff',
        color: previewStyles.text || '#000000'
      }}>
        <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: previewStyles.primary }}>
              Sample Header
            </h3>
            <p className="mb-4">
              This is a preview of how your store might look with the selected color scheme.
            </p>
            <Button style={{ 
              backgroundColor: previewStyles.primary,
              color: previewStyles.background 
            }}>
              Primary Button
            </Button>
          </Card>
          <Card className="p-4">
            <h4 className="text-lg font-bold mb-2" style={{ color: previewStyles.secondary }}>
              Secondary Section
            </h4>
            <p className="mb-4">
              Here's how secondary elements will appear in your store.
            </p>
            <Button style={{ 
              backgroundColor: previewStyles.secondary,
              color: previewStyles.background 
            }}>
              Secondary Button
            </Button>
          </Card>
          <Card className="p-4">
            <h4 className="text-lg font-bold mb-2" style={{ color: previewStyles.accent }}>
              Accent Section
            </h4>
            <p className="mb-4">
              This shows how accent colors will be used throughout your store.
            </p>
            <Button style={{ 
              backgroundColor: previewStyles.accent,
              color: previewStyles.background 
            }}>
              Accent Button
            </Button>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={handleCreateStore}
          disabled={isCreatingStore}
          size="lg"
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isCreatingStore ? "Creating Store..." : "Create Store"}
        </Button>
      </div>
    </div>
  );
};

export default StoreDesignAssistant;
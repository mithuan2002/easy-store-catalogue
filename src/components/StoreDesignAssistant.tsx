
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface StyleChange {
  title: string;
  description: string;
  styles: Record<string, any>;
}

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<StyleChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const applyStyles = (styles: Record<string, any>) => {
    const root = document.documentElement;
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string);
    });
  };

  const generateKhromaColors = (promptText: string) => {
    const colorPalettes = {
      modern: {
        primary: '#2563eb',
        secondary: '#4b5563',
        accent: '#06b6d4',
        background: '#f8fafc',
        text: '#1e293b'
      },
      minimal: {
        primary: '#000000',
        secondary: '#404040',
        accent: '#737373',
        background: '#ffffff',
        text: '#171717'
      },
      vibrant: {
        primary: '#7c3aed',
        secondary: '#2dd4bf',
        accent: '#f43f5e',
        background: '#fafafa',
        text: '#18181b'
      },
      elegant: {
        primary: '#a78bfa',
        secondary: '#f0abfc',
        accent: '#818cf8',
        background: '#fdf4ff',
        text: '#4c1d95'
      }
    };

    const promptLower = promptText.toLowerCase();
    let selectedPalette = 'modern';

    if (promptLower.includes('minimal')) selectedPalette = 'minimal';
    else if (promptLower.includes('vibrant')) selectedPalette = 'vibrant';
    else if (promptLower.includes('elegant')) selectedPalette = 'elegant';

    return colorPalettes[selectedPalette as keyof typeof colorPalettes];
  };

  const handleDesignGeneration = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const colors = generateKhromaColors(prompt);
      const suggestion = {
        title: `${prompt} Design`,
        description: `Khroma-inspired ${prompt.toLowerCase()} color palette`,
        styles: colors
      };

      setSuggestions([suggestion]);
      applyStyles(colors);
    } catch (error) {
      console.error('Error generating design:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 max-w-xl mx-auto my-4">
      <h2 className="text-2xl font-bold">Store Design Assistant</h2>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your desired design style (e.g., 'modern', 'minimal', 'vibrant', 'elegant')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleDesignGeneration}
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? "Generating Design..." : "Generate Design"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Color Palette</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-4 space-y-4">
              <h4 className="font-bold">{suggestion.title}</h4>
              <p className="text-gray-600">{suggestion.description}</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(suggestion.styles).map(([key, value], i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg"
                    style={{ backgroundColor: value }}
                    title={`${key}: ${value}`}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default StoreDesignAssistant;

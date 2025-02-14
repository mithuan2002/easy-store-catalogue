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
      root.style.setProperty(key, value as string);
    });
  };

  const generateKhromaColors = (promptText: string) => {
    // Khroma-inspired color combinations
    const colorSchemes = {
      modern: {
        primary: '#2D3436',
        secondary: '#636E72',
        accent: '#0984E3',
        background: '#DFE6E9',
        text: '#2D3436'
      },
      minimal: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
        background: '#FFFFFF',
        text: '#000000'
      },
      bold: {
        primary: '#6C5CE7',
        secondary: '#A29BFE',
        accent: '#00B894',
        background: '#2D3436',
        text: '#FFFFFF'
      },
      elegant: {
        primary: '#B2967D',
        secondary: '#E6BEAE',
        accent: '#C98474',
        background: '#EEE4E1',
        text: '#4A4238'
      }
    };

    const promptLower = promptText.toLowerCase();
    let scheme = 'modern';

    if (promptLower.includes('minimal')) scheme = 'minimal';
    else if (promptLower.includes('bold')) scheme = 'bold';
    else if (promptLower.includes('elegant')) scheme = 'elegant';

    const colors = colorSchemes[scheme as keyof typeof colorSchemes];

    return {
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--accent': colors.accent,
      '--background': colors.background,
      '--text': colors.text,
      backgroundColor: colors.background,
      color: colors.text
    };
  };

  const handleDesignSuggestion = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const styles = generateKhromaColors(prompt);
      const suggestion = {
        title: `${prompt} Design`,
        description: `Applied ${prompt.toLowerCase()} design with Khroma-inspired color palette`,
        styles,
      };

      setSuggestions([suggestion]);
      applyStyles(styles);
    } catch (error) {
      console.error('Error applying design:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 max-w-xl mx-auto my-4">
      <h2 className="text-2xl font-bold">Store Design Assistant</h2>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your desired store design (e.g., 'Make it modern and luxurious', 'Create a minimal tech store look')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleDesignSuggestion}
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? "Generating Design..." : "Generate Design"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generated Design</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-4 space-y-4">
              <h4 className="font-bold">{suggestion.title}</h4>
              <p className="text-gray-600">{suggestion.description}</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(suggestion.styles)
                  .filter(([key]) => key.startsWith('--'))
                  .map(([key, value], i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg"
                      style={{ backgroundColor: value as string }}
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
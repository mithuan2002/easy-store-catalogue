
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

  const applyStoreStyles = (styles: Record<string, any>) => {
    // Apply styles to the root element
    const root = document.documentElement;
    
    // Store theme colors
    const themeColors = {
      modern: {
        '--background': '210 40% 98%',
        '--foreground': '222.2 47.4% 11.2%',
        '--muted': '210 40% 96.1%',
        '--muted-foreground': '215.4 16.3% 46.9%',
        '--primary': '222.2 47.4% 11.2%',
        '--primary-foreground': '210 40% 98%',
      },
      minimal: {
        '--background': '0 0% 100%',
        '--foreground': '240 10% 3.9%',
        '--muted': '240 4.8% 95.9%',
        '--muted-foreground': '240 3.8% 46.1%',
        '--primary': '240 5.9% 10%',
        '--primary-foreground': '0 0% 98%',
      },
      colorful: {
        '--background': '142.1 76.2% 36.3%',
        '--foreground': '355.7 100% 97.3%',
        '--muted': '142.1 76.2% 36.3%',
        '--muted-foreground': '355.7 100% 97.3%',
        '--primary': '355.7 100% 97.3%',
        '--primary-foreground': '144.9 80.4% 10%',
      }
    };

    // Apply theme based on prompt keywords
    let theme = themeColors.modern;
    if (prompt.toLowerCase().includes('minimal')) {
      theme = themeColors.minimal;
    } else if (prompt.toLowerCase().includes('colorful')) {
      theme = themeColors.colorful;
    }

    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply additional custom styles
    Object.entries(styles).forEach(([key, value]) => {
      document.body.style[key as any] = value as string;
    });
  };

  const handleDesignSuggestion = async () => {
    setIsLoading(true);
    try {
      // Parse prompt and generate appropriate styles
      const styles: Record<string, any> = {
        fontFamily: prompt.includes('modern') ? 'Inter, sans-serif' : 'system-ui, sans-serif',
        padding: prompt.includes('spacious') ? '2rem' : '1rem',
        maxWidth: prompt.includes('wide') ? '1400px' : '1200px',
      };

      const suggestion = {
        title: `${prompt.includes('modern') ? 'Modern' : 'Classic'} Design`,
        description: `Applied ${prompt.includes('spacious') ? 'spacious' : 'compact'} layout with ${prompt.includes('modern') ? 'modern' : 'classic'} styling`,
        styles
      };

      setSuggestions([suggestion]);
      applyStoreStyles(styles);
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
          placeholder="Describe your desired store design (e.g., 'Make it modern and spacious')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleDesignSuggestion}
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? "Applying design..." : "Apply Design Changes"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Applied Design Changes</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-4">
              <h4 className="font-bold">{suggestion.title}</h4>
              <p className="text-gray-600">{suggestion.description}</p>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};


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
    // Get the root element and body
    const root = document.documentElement;
    const body = document.body;

    // Apply theme colors and styles
    Object.entries(styles).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value as string);
      } else {
        body.style[key as any] = value as string;
      }
    });
  };

  const handleDesignSuggestion = async () => {
    setIsLoading(true);
    try {
      // Define different style presets based on keywords
      const stylePresets = {
        modern: {
          '--background': '0 0% 100%',
          '--foreground': '222.2 84% 4.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '222.2 84% 4.9%',
          '--primary': '221.2 83.2% 53.3%',
          '--primary-foreground': '210 40% 98%',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#ffffff',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        },
        minimal: {
          '--background': '0 0% 98%',
          '--foreground': '240 10% 3.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '240 10% 3.9%',
          '--primary': '240 5.9% 10%',
          '--primary-foreground': '0 0% 98%',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#fafafa',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1.5rem'
        },
        colorful: {
          '--background': '142.1 76.2% 36.3%',
          '--foreground': '355.7 100% 97.3%',
          '--card': '142.1 76.2% 36.3%',
          '--card-foreground': '355.7 100% 97.3%',
          '--primary': '355.7 100% 97.3%',
          '--primary-foreground': '144.9 80.4% 10%',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#2ecc71',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '2rem'
        }
      };

      // Select style preset based on prompt
      let selectedStyle = stylePresets.modern;
      let styleTitle = "Modern Design";
      
      if (prompt.toLowerCase().includes('minimal')) {
        selectedStyle = stylePresets.minimal;
        styleTitle = "Minimal Design";
      } else if (prompt.toLowerCase().includes('colorful')) {
        selectedStyle = stylePresets.colorful;
        styleTitle = "Colorful Design";
      }

      const suggestion = {
        title: styleTitle,
        description: `Applied ${styleTitle.toLowerCase()} with optimized layout and styling`,
        styles: selectedStyle
      };

      setSuggestions([suggestion]);
      applyStyles(selectedStyle);
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
          placeholder="Describe your desired store design (e.g., 'Make it modern', 'Make it minimal', 'Make it colorful')"
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

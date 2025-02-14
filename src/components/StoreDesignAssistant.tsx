
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface StyleChange {
  title: string;
  description: string;
  styles: Record<string, any>;
}

const getDesignStyles = (prompt: string) => {
  const promptLower = prompt.toLowerCase();
  
  // Sophisticated style mappings based on common design keywords
  if (promptLower.includes('modern') || promptLower.includes('sleek')) {
    return {
      styles: {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '222.2 84% 4.9%',
        '--primary': '221.2 83.2% 53.3%',
        '--primary-foreground': '210 40% 98%',
        '--radius': '0.75rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#ffffff',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      },
      name: 'Modern'
    };
  }
  
  if (promptLower.includes('minimal') || promptLower.includes('clean')) {
    return {
      styles: {
        '--background': '0 0% 98%',
        '--foreground': '240 10% 3.9%',
        '--card': '0 0% 100%',
        '--card-foreground': '240 10% 3.9%',
        '--primary': '240 5.9% 10%',
        '--primary-foreground': '0 0% 98%',
        '--radius': '0.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#fafafa',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '1.5rem'
      },
      name: 'Minimal'
    };
  }
  
  if (promptLower.includes('bold') || promptLower.includes('dark')) {
    return {
      styles: {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--card': '222.2 84% 4.9%',
        '--card-foreground': '210 40% 98%',
        '--primary': '217.2 91.2% 59.8%',
        '--primary-foreground': '222.2 47.4% 11.2%',
        '--radius': '1rem',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundColor: '#1a1a1a',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      },
      name: 'Bold'
    };
  }

  if (promptLower.includes('colorful') || promptLower.includes('vibrant')) {
    return {
      styles: {
        '--background': '142.1 76.2% 36.3%',
        '--foreground': '355.7 100% 97.3%',
        '--card': '142.1 76.2% 36.3%',
        '--card-foreground': '355.7 100% 97.3%',
        '--primary': '355.7 100% 97.3%',
        '--primary-foreground': '144.9 80.4% 10%',
        '--radius': '0.75rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#2ecc71',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      },
      name: 'Colorful'
    };
  }

  // Default to modern style
  return getDesignStyles('modern');
};

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<StyleChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const applyStyles = (styles: Record<string, any>) => {
    const root = document.documentElement;
    const body = document.body;

    Object.entries(styles).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value as string);
      } else {
        body.style[key as any] = value as string;
      }
      
      // Apply styles to all product cards
      if (key === 'backgroundColor') {
        document.querySelectorAll('.product-card').forEach((card) => {
          (card as HTMLElement).style.backgroundColor = value as string;
        });
      }
    });
  };

  const handleDesignSuggestion = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const { styles, name } = getDesignStyles(prompt);
      const suggestion = {
        title: `${name} Design`,
        description: `Applied ${name.toLowerCase()} design with optimized layout and styling`,
        styles
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
          placeholder="Describe your desired store design (e.g., 'Make it modern', 'Make it minimal', 'Make it bold', 'Make it colorful')"
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

export default StoreDesignAssistant;

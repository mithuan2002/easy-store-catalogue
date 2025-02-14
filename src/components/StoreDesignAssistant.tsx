
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

interface StyleChange {
  title: string;
  description: string;
  styles: Record<string, any>;
}

const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<StyleChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const applyStyles = (styles: Record<string, any>) => {
    // Get all relevant elements
    const root = document.documentElement;
    const body = document.body;
    const productCards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input, textarea');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Apply CSS variables and general styles
    Object.entries(styles).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value as string);
      } else {
        body.style[key as any] = value as string;
      }
    });

    // Apply specific element styles
    productCards.forEach(card => {
      const element = card as HTMLElement;
      element.style.backgroundColor = styles.cardBackground || styles.backgroundColor || '#ffffff';
      element.style.borderRadius = styles.borderRadius || '0.5rem';
      element.style.padding = styles.padding || '1rem';
      element.style.boxShadow = styles.boxShadow || '0 2px 4px rgba(0,0,0,0.1)';
    });

    buttons.forEach(button => {
      const element = button as HTMLElement;
      element.style.backgroundColor = styles.buttonColor || styles.primary || '#2563eb';
      element.style.color = styles.buttonText || '#ffffff';
      element.style.borderRadius = styles.buttonRadius || '0.375rem';
    });

    inputs.forEach(input => {
      const element = input as HTMLElement;
      element.style.backgroundColor = styles.inputBackground || '#ffffff';
      element.style.borderColor = styles.borderColor || '#e2e8f0';
      element.style.borderRadius = styles.inputRadius || '0.375rem';
    });

    headings.forEach(heading => {
      const element = heading as HTMLElement;
      element.style.color = styles.headingColor || styles.foreground || '#000000';
      element.style.fontFamily = styles.fontFamily || 'inherit';
    });
  };

  const getDesignStyles = (promptText: string) => {
    const promptLower = promptText.toLowerCase();
    
    if (promptLower.includes('modern') || promptLower.includes('sleek')) {
      return {
        styles: {
          '--background': '0 0% 100%',
          '--foreground': '222.2 84% 4.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '222.2 84% 4.9%',
          '--primary': '221.2 83.2% 53.3%',
          backgroundColor: '#ffffff',
          cardBackground: '#ffffff',
          buttonColor: '#2563eb',
          buttonText: '#ffffff',
          headingColor: '#1e293b',
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1.5rem'
        },
        name: 'Modern'
      };
    }
    
    if (promptLower.includes('minimal') || promptLower.includes('clean')) {
      return {
        styles: {
          '--background': '0 0% 98%',
          '--foreground': '240 10% 3.9%',
          backgroundColor: '#fafafa',
          cardBackground: '#ffffff',
          buttonColor: '#18181b',
          buttonText: '#ffffff',
          headingColor: '#18181b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '1rem'
        },
        name: 'Minimal'
      };
    }
    
    if (promptLower.includes('bold') || promptLower.includes('dark')) {
      return {
        styles: {
          '--background': '222.2 84% 4.9%',
          '--foreground': '210 40% 98%',
          backgroundColor: '#1a1a1a',
          cardBackground: '#2d2d2d',
          buttonColor: '#3b82f6',
          buttonText: '#ffffff',
          headingColor: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: '1rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
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
          backgroundColor: '#2ecc71',
          cardBackground: '#ffffff',
          buttonColor: '#e74c3c',
          buttonText: '#ffffff',
          headingColor: '#2c3e50',
          fontFamily: 'system-ui, sans-serif',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '1.5rem'
        },
        name: 'Colorful'
      };
    }

    return getDesignStyles('modern');
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

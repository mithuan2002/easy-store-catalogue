import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import OpenAI from "openai";

interface StyleChange {
  title: string;
  description: string;
  styles: Record<string, any>;
  imageUrl?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<StyleChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const applyStyles = (styles: Record<string, any>) => {
    const root = document.documentElement;
    const body = document.body;
    const productCards = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input, textarea');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    Object.entries(styles).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value as string);
      } else {
        body.style[key as any] = value as string;
      }
    });

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

  const generateDesignWithDallE = async (promptText: string) => {
    try {
      const response = await openai.images.generate({
        prompt: `Modern e-commerce store design with ${promptText} style. Show color scheme and layout.`,
        n: 1,
        size: "1024x1024",
      });

      return response.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const getDesignStyles = async (promptText: string) => {
    const imageUrl = await generateDesignWithDallE(promptText);
    const promptLower = promptText.toLowerCase();

    let styles = {
      '--background': '0 0% 100%',
      '--foreground': '222.2 84% 4.9%',
      backgroundColor: '#ffffff',
      cardBackground: '#ffffff',
      buttonColor: '#2563eb',
      buttonText: '#ffffff',
      headingColor: '#1e293b',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '1.5rem'
    };

    // Customize styles based on prompt
    if (promptLower.includes('modern')) {
      styles.buttonColor = '#2563eb';
    } else if (promptLower.includes('minimal')) {
      styles.buttonColor = '#18181b';
      styles.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
    } else if (promptLower.includes('bold')) {
      styles.backgroundColor = '#1a1a1a';
      styles.cardBackground = '#2d2d2d';
      styles.headingColor = '#ffffff';
    }

    return {
      styles,
      name: promptText,
      imageUrl
    };
  };

  const handleDesignSuggestion = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const { styles, name, imageUrl } = await getDesignStyles(prompt);
      const suggestion = {
        title: `${name} Design`,
        description: `Applied ${name.toLowerCase()} design with AI-generated styling`,
        styles,
        imageUrl
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
      <h2 className="text-2xl font-bold">AI Store Design Assistant</h2>
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
          {isLoading ? "Generating AI Design..." : "Generate Design"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">AI-Generated Design</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-4 space-y-4">
              <h4 className="font-bold">{suggestion.title}</h4>
              <p className="text-gray-600">{suggestion.description}</p>
              {suggestion.imageUrl && (
                <img 
                  src={suggestion.imageUrl} 
                  alt="AI-generated design suggestion" 
                  className="w-full rounded-lg shadow-md"
                />
              )}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default StoreDesignAssistant;
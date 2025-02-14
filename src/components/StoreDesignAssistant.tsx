
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{title: string; description: string; styles: any}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDesignSuggestion = async () => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In production, you'd call an AI service
      const mockStyles = {
        modern: {
          backgroundColor: '#f8f9fa',
          fontFamily: 'Inter, sans-serif',
          '--primary': '222.2 47.4% 11.2%',
          '--secondary': '210 40% 96.1%'
        },
        minimal: {
          backgroundColor: '#ffffff',
          padding: '2rem',
          '--primary': '0 0% 0%',
          '--secondary': '0 0% 98%'
        }
      };

      // Parse prompt and generate suggestions
      const suggestions = [
        {
          title: prompt.includes('modern') ? "Modern Design" : "Minimalist Design",
          description: `Applied ${prompt.includes('modern') ? 'modern' : 'minimal'} styling with clean layout`,
          styles: prompt.includes('modern') ? mockStyles.modern : mockStyles.minimal
        }
      ];

      setSuggestions(suggestions);
      
      // Apply the first suggestion's styles
      if (suggestions[0].styles) {
        Object.entries(suggestions[0].styles).forEach(([key, value]) => {
          if (key.startsWith('--')) {
            document.documentElement.style.setProperty(key, value as string);
          } else {
            document.body.style[key as any] = value as string;
          }
        });
      }
    } catch (error) {
      console.error('Error applying design:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Store Design Assistant</h2>
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your desired store design (e.g., 'Make it modern and minimalist')"
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

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{title: string; description: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDesignSuggestion = async () => {
    setIsLoading(true);
    try {
      // For now using mock data - you'll need to add your OpenAI API key through Replit Secrets
      setSuggestions([
        {
          title: "Modern Minimalist Design",
          description: "Clean layout with ample white space and focused product imagery"
        },
        {
          title: "Color Scheme Update",
          description: "Use a calming palette of soft blues and neutral tones"
        }
      ]);
    } catch (error) {
      console.error('Error getting design suggestions:', error);
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
          {isLoading ? "Getting suggestions..." : "Get Design Suggestions"}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Design Suggestions</h3>
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
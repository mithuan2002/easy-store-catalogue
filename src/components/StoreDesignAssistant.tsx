import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export const StoreDesignAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDesignSuggestion = async () => {
    setIsLoading(true);
    try {
      // For demonstration, using mock data
      setSuggestions([
        {
          title: "Modern Minimalist Design",
          description: "Clean lines, minimal colors, focused on product presentation"
        }
      ]);
    } catch (error) {
      console.error("Error getting design suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Store Design Assistant</h2>
      <Textarea
        placeholder="Describe how you want your store to look..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleDesignSuggestion}
        disabled={isLoading || !prompt}
        className="w-full"
      >
        {isLoading ? "Generating suggestions..." : "Get Design Suggestions"}
      </Button>
      {suggestions.map((suggestion, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{suggestion.title}</h3>
          <p className="text-gray-600">{suggestion.description}</p>
        </div>
      ))}
    </div>
  );
};
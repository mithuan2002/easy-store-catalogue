
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SpreadsheetInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const SpreadsheetInput = ({ onSubmit, isLoading }: SpreadsheetInputProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid spreadsheet URL",
        variant: "destructive",
      });
      return;
    }
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-2">
          Product Catalog
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Import Your Products</h1>
        <p className="text-gray-500">Paste your Google Sheets or Excel URL below</p>
      </div>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 h-12"
        />
        <Button type="submit" disabled={isLoading} className="h-12 px-6">
          {isLoading ? "Loading..." : "Import"}
        </Button>
      </div>
    </form>
  );
};

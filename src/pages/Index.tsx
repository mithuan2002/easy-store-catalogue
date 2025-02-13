
import { useState } from "react";
import { SpreadsheetInput } from "@/components/SpreadsheetInput";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const extractSheetId = (url: string) => {
    const matches = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : null;
  };

  const handleSpreadsheetSubmit = async (url: string) => {
    setIsLoading(true);
    const sheetId = extractSheetId(url);

    if (!sheetId) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Google Sheets URL",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Convert Google Sheet to CSV format
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch spreadsheet data');
      }

      const csvText = await response.text();
      const rows = csvText.split('\n').map(row => row.split(','));
      
      // Assume first row contains headers
      const headers = rows[0].map(header => header.trim().toLowerCase());
      
      // Convert remaining rows to products
      const importedProducts = rows.slice(1).map((row, index) => {
        const product: Product = {
          id: (index + 1).toString(),
          name: '',
          price: '',
        };

        headers.forEach((header, i) => {
          const value = row[i]?.trim() || '';
          switch (header) {
            case 'name':
              product.name = value;
              break;
            case 'price':
              product.price = value;
              break;
            case 'description':
              product.description = value;
              break;
            case 'image':
              product.image = value;
              break;
            case 'category':
              product.category = value;
              break;
          }
        });

        return product;
      }).filter(product => product.name && product.price); // Only include products with at least a name and price

      if (importedProducts.length === 0) {
        throw new Error('No valid products found in the spreadsheet');
      }

      setProducts(importedProducts);
      toast({
        title: "Success",
        description: `Imported ${importedProducts.length} products successfully`,
      });
    } catch (error) {
      console.error("Error fetching spreadsheet:", error);
      toast({
        title: "Error",
        description: "Failed to import spreadsheet data. Make sure the sheet is publicly accessible and contains the required columns (name, price).",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <SpreadsheetInput onSubmit={handleSpreadsheetSubmit} isLoading={isLoading} />
        {products.length > 0 && (
          <div className="mt-12">
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

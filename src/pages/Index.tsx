
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

  const parseCsvRow = (row: string) => {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    return values.map(value => value.replace(/^"|"$/g, '').trim());
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
      const rows = csvText.split('\n').filter(row => row.trim().length > 0);
      
      if (rows.length < 2) {
        throw new Error('Spreadsheet must contain at least headers and one product');
      }

      // Parse headers (first row)
      const headers = parseCsvRow(rows[0]).map(header => header.toLowerCase().trim());
      
      // Validate required columns
      if (!headers.includes('name') || !headers.includes('price')) {
        throw new Error('Spreadsheet must contain "name" and "price" columns');
      }

      console.log('Headers found:', headers); // Debug log

      // Convert remaining rows to products
      const importedProducts = rows.slice(1).map((row, index) => {
        const values = parseCsvRow(row);
        console.log('Processing row:', values); // Debug log

        const product: Product = {
          id: (index + 1).toString(),
          name: '',
          price: '',
        };

        headers.forEach((header, i) => {
          const value = values[i] || '';
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
              // Only set the image URL if it's a valid URL
              if (value && isValidUrl(value)) {
                product.image = value;
              }
              break;
            case 'category':
              product.category = value;
              break;
          }
        });

        // If no valid image URL is provided, use a placeholder
        if (!product.image) {
          product.image = "https://source.unsplash.com/400x400/?product";
        }

        return product;
      }).filter(product => {
        const isValid = product.name && product.price;
        if (!isValid) {
          console.log('Invalid product:', product); // Debug log
        }
        return isValid;
      });

      if (importedProducts.length === 0) {
        throw new Error('No valid products found in the spreadsheet. Make sure you have "name" and "price" columns with valid data.');
      }

      console.log('Imported products:', importedProducts); // Debug log

      setProducts(importedProducts);
      toast({
        title: "Success",
        description: `Imported ${importedProducts.length} products successfully`,
      });
    } catch (error) {
      console.error("Error fetching spreadsheet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import spreadsheet data. Make sure the sheet is publicly accessible and contains the required columns (name, price).",
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

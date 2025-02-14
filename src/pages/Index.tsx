import { useState } from "react";
import { SpreadsheetInput } from "@/components/SpreadsheetInput";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreDesignAssistant } from "@/components/StoreDesignAssistant";

declare global {
  interface Window {
    createStore: (styles: any) => Promise<void>;
  }
}
import type { Product } from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");

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

  window.createStore = async (styles: any) => {
    if (!products.length || !spreadsheetUrl) {
      toast({
        title: "Error",
        description: "Please import products first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingStore(true);
    try {
      // First create the store
      // Get WhatsApp number from user
      const whatsappNumber = prompt("Please enter your WhatsApp number (with country code, e.g., +1234567890):");
      if (!whatsappNumber) {
        throw new Error("WhatsApp number is required");
      }

      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({
          name: 'My Store',
          sheets_url: spreadsheetUrl,
          whatsapp_number: whatsappNumber
        })
        .select()
        .single();

      if (storeError) throw storeError;

      // Then insert all products with price converted to number
      const productsToInsert = products.map(product => ({
        name: product.name,
        price: parseFloat(String(product.price)), // Convert to string first, then to number
        description: product.description || null,
        image_url: product.image || null,
        store_id: store.id
      }));

      const { error: productsError } = await supabase
        .from('products')
        .insert(productsToInsert);

      if (productsError) throw productsError;

      // Show success message with the store URL
      const storeUrl = `${window.location.origin}/store/${store.id}`;
      toast({
        title: "Success!",
        description: (
          <div className="space-y-2">
            <p>Your store has been created successfully.</p>
            <p className="font-medium">Store URL: <a href={storeUrl} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{storeUrl}</a></p>
          </div>
        ),
        duration: 10000, // Show for 10 seconds so user has time to copy
      });

    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        title: "Error",
        description: "Failed to create store. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handleSpreadsheetSubmit = async (url: string) => {
    setIsLoading(true);
    setSpreadsheetUrl(url);

    if (!url.includes('docs.google.com/spreadsheets')) {
      toast({
        title: "Error",
        description: "Please provide a valid Google Sheets URL",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
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

      console.log('Headers found:', headers);

      // Convert remaining rows to products
      const importedProducts = rows.slice(1).map((row, index) => {
        const values = parseCsvRow(row);
        console.log('Processing row:', values);

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
              if (value && isValidUrl(value)) {
                product.image = value;
              }
              break;
            case 'category':
              product.category = value;
              break;
          }
        });

        if (!product.image) {
          product.image = "https://source.unsplash.com/400x400/?product";
        }

        return product;
      }).filter(product => {
        const isValid = product.name && product.price;
        if (!isValid) {
          console.log('Invalid product:', product);
        }
        return isValid;
      });

      if (importedProducts.length === 0) {
        throw new Error('No valid products found in the spreadsheet. Make sure you have "name" and "price" columns with valid data.');
      }

      console.log('Imported products:', importedProducts);

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
          <div className="mt-12 space-y-8">
            <StoreDesignAssistant />
            <ProductGrid 
              products={products} 
              selectedProducts={new Set()}
              onToggleSelect={(product) => {
                console.log('Product selected:', product);
              }}
              isEditable={true}
              onEdit={(product) => {
                const newName = prompt("Enter new name:", product.name);
                const newPrice = prompt("Enter new price:", product.price);
                const newDescription = prompt("Enter new description:", product.description);
                const newImage = prompt("Enter new image URL:", product.image);

                if (newName && newPrice) {
                  const updatedProduct = {
                    ...product,
                    name: newName,
                    price: newPrice,
                    description: newDescription || "",
                    image: newImage || product.image,
                  };

                  setProducts(products.map(p => 
                    p.id === product.id ? updatedProduct : p
                  ));
                }
              }}
            />
            <div className="flex justify-center">
              <Button
                onClick={handleCreateStore}
                disabled={isCreatingStore}
                size="lg"
                className="mt-8"
              >
                {isCreatingStore ? "Creating Store..." : "Create Store"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
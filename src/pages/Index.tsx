
import { useState } from "react";
import { SpreadsheetInput } from "@/components/SpreadsheetInput";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/components/ProductCard";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const handleSpreadsheetSubmit = async (url: string) => {
    setIsLoading(true);
    // TODO: Implement actual spreadsheet fetching logic
    // For now, we'll use mock data
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data
      setProducts([
        {
          id: "1",
          name: "Sample Product 1",
          price: "$99.99",
          description: "This is a sample product description",
          image: "https://source.unsplash.com/400x400/?product",
          category: "Electronics",
        },
        {
          id: "2",
          name: "Sample Product 2",
          price: "$149.99",
          description: "Another sample product description",
          image: "https://source.unsplash.com/400x400/?gadget",
          category: "Accessories",
        },
        // Add more mock products as needed
      ]);
    } catch (error) {
      console.error("Error fetching spreadsheet:", error);
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


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/components/ProductCard";

const Store = () => {
  const { id } = useParams();
  const [store, setStore] = useState<{ name: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', id)
          .single();

        if (storeError) throw storeError;
        setStore(storeData);

        // Fetch store products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', id);

        if (productsError) throw productsError;

        const formattedProducts = productsData.map(product => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price.toString(),
          description: product.description || undefined,
          image: product.image_url || undefined,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching store:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading store...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Store not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">{store.name}</h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Store;

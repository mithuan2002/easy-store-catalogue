
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

const Store = () => {
  const { id } = useParams();
  const [store, setStore] = useState<{ name: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

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
        setNewName(storeData.name);

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

  const handleSaveName = async () => {
    if (!id || !newName.trim()) return;

    try {
      const { error } = await supabase
        .from('stores')
        .update({ name: newName.trim() })
        .eq('id', id);

      if (error) throw error;

      setStore(prev => prev ? { ...prev, name: newName.trim() } : null);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Store name updated successfully",
      });
    } catch (error) {
      console.error('Error updating store name:', error);
      toast({
        title: "Error",
        description: "Failed to update store name",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setNewName(store?.name || "");
    setIsEditing(false);
  };

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
        <div className="flex items-center gap-4 mb-8">
          {isEditing ? (
            <>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="text-3xl font-bold max-w-md"
                placeholder="Enter store name"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveName}
                className="text-green-600 hover:text-green-700"
              >
                <CheckIcon className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-700"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-gray-700"
              >
                <PencilIcon className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default Store;

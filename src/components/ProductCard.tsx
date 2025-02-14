import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilIcon } from "@heroicons/react/24/outline";

export interface Product {
  id: string;
  name: string;
  price: string | number;
  description?: string;
  image?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (product: Product) => void;
  isEditable?: boolean;
  onEdit?: (product: Product) => void;
}

export const ProductCard = ({ 
  product,
  isSelected,
  onToggleSelect,
  isEditable = false,
  onEdit,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !product.image 
    ? "https://source.unsplash.com/400x400/?product" 
    : product.image;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn relative">
      <CardContent className="p-0">
        <div className="absolute top-4 right-4 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(product)}
          />
        </div>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
        <div className="p-6 space-y-2">
          {product.category && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category}
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              <p className="text-2xl font-semibold">{product.price}</p>
              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
              )}
            </div>
            {isEditable && onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
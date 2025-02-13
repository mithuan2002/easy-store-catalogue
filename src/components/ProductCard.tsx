
import { Card, CardContent } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  price: string | number;
  description?: string;
  image?: string;
  category?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <CardContent className="p-0">
        {product.image && (
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-6 space-y-2">
          {product.category && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category}
            </div>
          )}
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <p className="text-2xl font-semibold">{product.price}</p>
          {product.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

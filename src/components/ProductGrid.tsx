
import { Product, ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  selectedProducts: Set<string>;
  onToggleSelect: (product: Product) => void;
  isEditable?: boolean;
  onEdit?: (product: Product) => void;
}

export const ProductGrid = ({ 
  products,
  selectedProducts,
  onToggleSelect,
  isEditable = false,
  onEdit,
}: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          isSelected={selectedProducts.has(product.id)}
          onToggleSelect={onToggleSelect}
          isEditable={isEditable}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

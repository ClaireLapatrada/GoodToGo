// app/productContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface RecommendedAction {
  action: string;
  value: number;
}

interface Product {
  name: string;
  id: string;
  price: number;
  ordered: string;
  received: string;
  condition?: string;
  estimatedRefundValue?: number;
  eligibleForResale?: boolean;
  repairsNeeded?: boolean;
  recommendedAction?: RecommendedAction[];
  recommendedRepair?: string;
  isWardrobing?: boolean;
  image1?: string | null;
}

interface ProductContextType {
  product: Product | null;
  setProduct: (product: Product | null) => void;
}

export const ProductContext = createContext<ProductContextType>({
  product: null,
  setProduct: () => {},
});

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Add a default export - this can be the Provider
export default ProductProvider;
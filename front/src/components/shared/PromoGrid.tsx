import { PromoCard } from "@/components/shared/PromoCard";

interface Product {
  productName: string;
  storeName: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  timeLeft: string;
  imageUrl;
}

export default function PromoGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6  min-h-screen">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 w-full max-w-7xl mx-auto px-4">
        {products.map((product) => (
          <PromoCard key={product.productName} product={product} />
        ))}
      </div>
    </div>
  );
}

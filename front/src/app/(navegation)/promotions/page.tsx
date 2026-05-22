import PromoGrid from "@/components/shared/PromoGrid";

async function fetchPromos() {
  return [
    {
      productName: "Mouse Gamer Sem Fio RGB 16000 DPI",
      storeName: "TechZone Brasil",
      originalPrice: 349.9,
      discountPrice: 244.93,
      discountPercentage: 30,
      timeLeft: "02:45:12",
      imageUrl:
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    },
    {
      productName: "Teclado Mecânico Switch Blue ABNT2",
      storeName: "Master Computadores",
      originalPrice: 299.0,
      discountPrice: 179.4,
      discountPercentage: 40,
      timeLeft: "05:12:00",
      imageUrl:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    },
    {
      productName: "Headset Noise Cancelling Bluetooth",
      storeName: "Som & Cia",
      originalPrice: 599.9,
      discountPrice: 449.92,
      discountPercentage: 25,
      timeLeft: "00:30:45",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    },
    {
      productName: 'Monitor Gamer 24" IPS 144Hz 1ms',
      storeName: "Mega Info",
      originalPrice: 1299.0,
      discountPrice: 909.3,
      discountPercentage: 30,
      timeLeft: "12:22:18",
      imageUrl:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    },
    {
      productName: "Cadeira Ergonômica de Escritório Preta",
      storeName: "Confort Office",
      originalPrice: 849.0,
      discountPrice: 594.3,
      discountPercentage: 30,
      timeLeft: "08:15:30",
      imageUrl:
        "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80",
    },
    {
      productName: "Smartwatch Sport à Prova D'água",
      storeName: "Eletro World",
      originalPrice: 450.0,
      discountPrice: 225.0,
      discountPercentage: 50,
      timeLeft: "01:05:00",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    },
    {
      productName: "Carregador Portátil Power Bank 20000mAh",
      storeName: "TechZone Brasil",
      originalPrice: 199.9,
      discountPrice: 159.92,
      discountPercentage: 20,
      timeLeft: "18:40:12",
      imageUrl:
        "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80",
    },
  ];
}

export default async function Promotions() {
  const products = await fetchPromos();
  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6  min-h-screen">
      <PromoGrid products={products} />
    </div>
  );
}

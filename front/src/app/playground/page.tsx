import { LoginCard } from "@/components/shared/login";
import { UserTypeSelector } from "@/components/shared/UserTypeSelector";
import { RegisterStepperForm } from "@/components/shared/RegisterStepperStore";
import { PromoCard } from "@/components/shared/PromoCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { BottomNav } from "@/components/shared/BottomNav";
import { CreateAdForm } from "@/components/shared/CreateAdForm";
import { RedeemedProductBadge } from "@/components/shared/RedeemedProductBadge";
import { RedemptionCodeCard } from "@/components/shared/RedemptionCodeCard";
import { UserProfileCard } from "@/components/shared/UserProfileCard";
import { PromotionDetailCard } from "@/components/shared/PromotionDetailsCard";
import { RegisterStepperFormClient } from "@/components/shared/RegisterStepperClient";
import { RegisterStepperFormStore } from "@/components/shared/RegisterStepperStore";

export default function Playground() {
  return (
    <div>
      {/* <h1 className="text-center">Playground</h1> */}
      {/* <LoginCard /> */}
      {/* <UserTypeSelector /> */}
      {/* <RegisterStepperForm /> */}
      {/* <PromoCard /> */}
      {/* <SearchBar /> */}
      {/* <BottomNav />
      <CreateAdForm /> */}
      {/* <RedeemedProductBadge
        imageUrl=""
        productName="Produto Exemplo"
        quantity={5}
      />
      <RedemptionCodeCard
        imageUrl=""
        productName="Produto Exemplo"
        quantity={5}
        code="ABC123"
      />

      <UserProfileCard
        name="Marcos César Marinho"
        email="marcos.marinho@email.com"
        phone="(11) 99999-9999"
      /> */}

      {/* <PromotionDetailCard
        imageUrl="https://images.unsplash.com/photo-1622445262465-2481c4574875?w=800&q=80" // Imagem mock do Unsplash (Carregador)
        badgeDiscount="20% off"
        title="Carregador tipo C"
        description="Compatível com uma ampla gama de modelos de smartphones, incluindo Xiaomi, Samsung e outras marcas de ponta com suporte a carregamento rápido Turbo Power."
        requirements="Comprar 50 reais em compras no estabelecimento."
        stock={4} // Quantidade em estoque
        userLimit={2} // Limite máximo por utilizador (o stepper vai travar aqui!)
        duration="1d:12h"
        storeName="Super Cell"
        storeHours="Segunda a Sexta: 09h às 18h"
        storeLocation="Rua Principal, 123 - Centro"
        originalPrice="R$ 49,90"
        discountPrice="R$ 39,90"
      /> */}

      {/* <RegisterStepperFormStore /> */}
      <RegisterStepperFormClient />
      <CreateAdForm />
    </div>
  );
}

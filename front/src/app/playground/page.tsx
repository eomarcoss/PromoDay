import { LoginCard } from "@/components/shared/login";
import { UserTypeSelector } from "@/components/shared/UserTypeSelector";
import { RegisterStepperForm } from "@/components/shared/RegisterStepperForm";
import { PromoCard } from "@/components/shared/PromoCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { BottomNav } from "@/components/shared/BottomNav";
import { CreateAdForm } from "@/components/shared/CreateAdForm";
import { RedeemedProductBadge } from "@/components/shared/RedeemedProductBadge";
import { RedemptionCodeCard } from "@/components/shared/RedemptionCodeCard";
import { UserProfileCard } from "@/components/shared/UserProfileCard";

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
      <RedeemedProductBadge
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
      />
    </div>
  );
}

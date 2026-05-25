import { RedemptionCodeCard } from "./RedemptionCodeCard";

export default function RedeemsList() {
  return (
    <div className="h-auto text-white p-3 flex flex-col gap-4 items-center w-full mx-auto">
      {/* Exemplo 1: Resgate1 */}
      <RedemptionCodeCard
        imageUrl=""
        productName="Produto Exemplo"
        quantity={5}
        code="ABC123"
      />
    </div>
  );
}

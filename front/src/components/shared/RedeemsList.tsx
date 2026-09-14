import { RedemptionCodeCard } from "./RedemptionCodeCard";
import { getUserClaims } from "@/app/actions/get-user-claims";

const CARD_VARIANTS = ["green", "blue", "amber"] as const;

export default async function RedeemsList() {
  const claims = await getUserClaims();

  if (claims.length === 0) {
    return (
      <div className="h-auto text-gray-500 p-8 flex flex-col items-center justify-center w-full max-w-xl mx-auto text-center bg-[#DDF899] border border-border/60 rounded-3xl mt-4">
        <p className="text-base font-semibold text-[#111827]">
          Nenhum cupom resgatado
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Explore as ofertas disponíveis e resgate cupons para visualizá-los aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="h-auto p-2 sm:p-4 flex flex-col gap-4 items-center w-full max-w-6xl mx-auto">
      {claims.map((claim, index) => {
        const mainImage =
          claim.promotion?.images && claim.promotion.images.length > 0
            ? claim.promotion.images[0]
            : "/placeholder.png";

        const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];

        return (
          <RedemptionCodeCard
            key={claim.id}
            imageUrl={mainImage}
            productName={claim.promotion?.name || "Produto em promoção"}
            quantity={claim.quantity || 1}
            code={claim.code}
            status={claim.status}
            seller={claim.promotion?.seller}
          />
        );
      })}
    </div>
  );
}

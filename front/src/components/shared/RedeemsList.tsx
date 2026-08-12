import { RedemptionCodeCard } from "./RedemptionCodeCard";
import { getUserClaims } from "@/app/actions/get-user-claims";

export default async function RedeemsList() {
  const claims = await getUserClaims();

  console.log("Claims fetched in RedeemsList:", claims);
  if (claims.length === 0) {
    return (
      <div className="h-auto text-zinc-400 p-6 flex flex-col items-center justify-center w-full mx-auto text-center">
        <p className="text-base font-medium">
          Você ainda não possui cupons resgatados.
        </p>
      </div>
    );
  }

  return (
    <div className="h-auto text-white p-3 flex flex-col gap-4 items-center w-full mx-auto">
      {claims.map((claim) => {
        const mainImage =
          claim.promotion?.images && claim.promotion.images.length > 0
            ? claim.promotion.images[0]
            : "/placeholder.png";

        return (
          <RedemptionCodeCard
            key={claim.id}
            imageUrl={mainImage}
            productName={claim.promotion?.name || "Produto em promoção"}
            quantity={claim.quantity || 1}
            code={claim.code}
            status={claim.status}
          />
        );
      })}
    </div>
  );
}

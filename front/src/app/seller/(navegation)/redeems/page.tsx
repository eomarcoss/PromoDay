export const dynamic = "force-dynamic";

import { ValidateCodeModal } from "@/components/shared/ValidateCodeModal";
import RedeemsList from "../../../../components/shared/RedeemsList";

export default function Redeems() {
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <ValidateCodeModal />
      {/* <RedeemsList /> */}
    </div>
  );
}

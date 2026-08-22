import { ValidateCodeModal } from "@/components/shared/ValidateCodeModal";
import RedeemsList from "../../../../components/shared/RedeemsList";

export default function Redeems() {
  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <h1 className="text-2xl text-center font-bold text-black">Resgates</h1>
      <ValidateCodeModal />
      {/* <RedeemsList /> */}
    </div>
  );
}

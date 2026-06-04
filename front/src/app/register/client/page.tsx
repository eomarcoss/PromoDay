"use-client";
import { RegisterStepperFormClient } from "@/components/shared/RegisterStepperClient";

export default function RegisterClientPage() {
  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-6 flex items-center justify-center min-h-screen">
      <RegisterStepperFormClient />
    </div>
  );
}

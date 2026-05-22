"use client";
import Storelist from "@/components/shared/StoreList";

export default function Stores() {
  return (
    <div className="w-full max-w-9xl px-4 sm:px-6 lg:px-8 space-y-3  min-h-screen">
      <h1 className="text-2xl text-center font-bold text-black">Lojas</h1>
      <Storelist />
    </div>
  );
}

'use client";';
import { UserProfileCard } from "@/components/shared/UserProfileCard";
export default function Profile() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 ">
      <h1 className="text-2xl text-center font-bold text-black">Minha conta</h1>
      <UserProfileCard
        name="João Silva"
        email="joao.silva@email.com"
        phone="(11) 98765-4321"
      />
    </div>
  );
}

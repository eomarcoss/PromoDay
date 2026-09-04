"use client";

import { CreateAdForm } from "@/components/shared/CreateAdForm";
import { Suspense } from "react";

export default function AnnouncePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAdForm />
    </Suspense>
  );
}

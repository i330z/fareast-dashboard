// /app/reset-password/page.js  (App Router example)
"use client";
import { Suspense } from "react";
import ResetPassword from "@/components/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading reset form...</p>}>
      <ResetPassword />
    </Suspense>
  );
}

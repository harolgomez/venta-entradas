import { Ticket } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Ticket className="w-10 h-10 text-accent mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-text-primary">
            Bienvenido de vuelta
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validators/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
          <span className="text-2xl">✉️</span>
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          Revisa tu email
        </h3>
        <p className="text-text-secondary text-sm">
          Te enviamos un email de confirmacion. Hace click en el enlace para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="password"
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {error && (
        <p className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-sm text-center text-text-secondary">
        Ya tenes cuenta?{" "}
        <Link href="/auth/login" className="text-accent hover:underline">
          Ingresa
        </Link>
      </p>
    </form>
  );
}

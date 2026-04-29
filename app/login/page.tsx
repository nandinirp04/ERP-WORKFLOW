"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginFormValues } from "@/features/auth/schema/login-schema";
import { login } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { isAdmin } from "@/utils/roles";
import { setAuthSessionCookies } from "@/utils/auth-session";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await login(values);

      setSession({
        user: response.user,
        tokens: response.tokens,
      });
      setAuthSessionCookies(response.user.role, { isFirstLogin: response.user.isFirstLogin });

      if (isAdmin(response.user.role)) {
        router.replace("/admin/dashboard");
        return;
      }

      if (response.user.isFirstLogin) {
        router.replace("/staff/reset-password");
        return;
      }

      router.replace("/staff/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setServerError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#E0E7FF,_#EEF2FF_40%,_#F8FAFC_75%)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.15)] backdrop-blur sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-[#4F46E5]">ERP Workflow</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Use your organization credentials to continue.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#334155]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...register("email")}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#334155]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password")}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#818CF8] focus:ring-4 focus:ring-[#C7D2FE]"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.password.message}</p>
            ) : null}
          </div>

          {serverError ? (
            <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#991B1B]">
              {serverError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(79,70,229,0.35)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#4F46E5] transition hover:text-[#4338CA]"
            >
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="mt-4 text-xs text-[#64748B]">
          Demo tip: use an email containing <span className="font-semibold">admin</span> for
          admin access, otherwise staff access.
        </p>
      </div>
    </div>
  );
}

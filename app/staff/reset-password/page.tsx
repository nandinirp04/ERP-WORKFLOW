"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth-store";
import { useERPStore } from "@/store/erp-store";
import { setFirstLoginCookie } from "@/utils/auth-session";

export default function ResetPasswordPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const tokens = useAuthStore((state) => state.tokens);
  const markFirstLoginDone = useERPStore((state) => state.markFirstLoginDone);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    if (!user || !tokens) {
      setError("Session expired. Please login again.");
      return;
    }

    if (user.staffId) {
      markFirstLoginDone(user.staffId);
    }

    setSession({
      user: {
        ...user,
        isFirstLogin: false,
      },
      tokens,
    });
    setFirstLoginCookie(false);
    router.replace("/staff/dashboard");
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card title="Reset Password" subtitle="Please update your default password to continue.">
        <div className="space-y-4">
          <Input
            id="old-password"
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
          />
          <Input
            id="new-password"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <Input
            id="confirm-password"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-[#B91C1C]">{error}</p> : null}
          <Button className="w-full" onClick={onSubmit}>
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  );
}

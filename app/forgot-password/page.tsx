"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#E0E7FF,_#EEF2FF_40%,_#F8FAFC_75%)] px-4 py-10">
      <div className="w-full max-w-md">
        <Card title="Forgot Password" subtitle="Request access reset from admin.">
          <div className="space-y-4">
            <Input
              id="forgot-email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
            <Button
              className="w-full"
              onClick={() => {
                if (!email.includes("@")) {
                  setMessage("Please enter a valid email.");
                  return;
                }

                setMessage("Request sent to admin");
              }}
            >
              Send Request
            </Button>
            {message ? (
              <p className="rounded-xl bg-[#EEF2FF] px-3 py-2 text-sm text-[#3730A3]">{message}</p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

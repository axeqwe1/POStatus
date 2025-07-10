"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useSearchParams } from "next/navigation";
import { log } from "console";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAuth } from "@/context/authContext";

interface ForgetPasswordFormProps extends ComponentProps<"form"> {
  sendMail: (Email: string) => void;
}
export function ForgetPasswordForm({
  sendMail,
  className,
  ...props
}: ForgetPasswordFormProps) {
  const COOLDOWN_KEY = "fp_cooldown_expire";

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0); // in seconds
  const { setIsAuthenticated, setUser, login, user } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedExpire = localStorage.getItem(COOLDOWN_KEY);
    if (storedExpire) {
      const expireTime = parseInt(storedExpire, 10);
      const remaining = Math.floor((expireTime - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
        setIsSending(true);
      } else {
        setIsSending(false);
        localStorage.removeItem(COOLDOWN_KEY); // ⬅️ ล้าง key เมื่อหมดเวลา
      }
    }
  }, [cooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      // setIsSending(false);
      // localStorage.removeItem(COOLDOWN_KEY); // ⬅️ ล้าง key เมื่อหมดเวลา
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSending) return;
    const email = emailRef.current?.value;
    if (!email) {
      setErrorMessage("Email is required");
      setIsError(true);
      return;
    }

    const cooldownSeconds = 30;
    const expireTimestamp = Date.now() + cooldownSeconds * 1000;
    localStorage.setItem(COOLDOWN_KEY, expireTimestamp.toString());

    setIsSending(true);
    setCooldown(cooldownSeconds);

    // ❗TODO: replace with real API call
    console.log("Sending reset password email...");
    sendMail(email!);
    // simulate success
    setTimeout(() => {
      // redirect("/resetpassword?token=1234567890");
    }, 1000);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset New Password</h1>
        </div>

        {isError && (
          <Alert className="text-red-500 text-sm bg-red-200">
            <AlertTitle>
              <span className="font-semibold">Failed!</span>
            </AlertTitle>
            <AlertDescription className="text-red-500 text-sm text-center">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          <Input
            ref={emailRef}
            id="email"
            type="email"
            placeholder="Email"
            required
          />

          <Button
            type="submit"
            disabled={isSending}
            className="w-full mt-3 text-white"
          >
            {isSending ? `Please wait ${cooldown}s` : "Send"}
          </Button>
        </div>
      </form>
    </>
  );
}

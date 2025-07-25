"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useSearchParams } from "next/navigation";
import { log } from "console";
import { ComponentProps, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAuth } from "@/context/authContext";

interface ResetPasswordFormProps extends ComponentProps<"form"> {
  open: boolean;
  resetPassword: (newPass: string, confirmNewPass: string) => void;
}
export function ResetPasswordForm({
  resetPassword,
  open,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated, setUser, login, user } = useAuth();
  const [valid, setValid] = useState<boolean>(false);
  const [charValid, setCharValid] = useState<boolean>(false);
  const isValidPassword = (password: string) =>
    password.length >= 6 &&
    /[A-Za-z]/.test(password) && // ต้องมีตัวอักษร
    /\d/.test(password); // ต้องมีตัวเลข

  const checkInput = (password: string) => {
    if (password.length >= 6) {
      setCharValid(true);
    } else {
      setCharValid(false);
    }
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) {
      setValid(true);
    } else {
      setValid(false);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (e.target.new_password.value != e.target.confirm_new_password.value) {
      setIsError(true);
      setErrorMessage("New password and confirm password is incorrect.");
    } else {
      setIsError(false);
      setErrorMessage("");
    }

    if (!isValidPassword(e.target.new_password.value)) {
      setIsError(true);
      setErrorMessage(
        "Password must be at least 6 characters and contain both letters and numbers."
      );
      return;
    }
    resetPassword(
      e.target.new_password.value,
      e.target.confirm_new_password.value
    );
  };
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          {/* <p className="text-muted-foreground text-sm text-balance">
            Change Password
          </p> */}
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
          <div className="grid gap-3">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              className="disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="New Password"
              onChange={(e) => checkInput(e.target.value)}
              required
              disabled={!open}
            />

            <Alert className="text-sm bg-gray-100">
              {/* <AlertTitle>
                <span className="font-semibold">Failed!</span>
              </AlertTitle> */}
              <AlertDescription className="text-[8px] text-center">
                <Label
                  className={`${
                    charValid ? "text-green-400" : "text-gray-400"
                  } `}
                >
                  Password must be at least 6 characters
                </Label>
                <Label
                  className={`${valid ? "text-green-400" : "text-gray-400"} `}
                >
                  Contain both letters and numbers
                </Label>
              </AlertDescription>
            </Alert>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username">Confirm New Password</Label>
            <Input
              id="confirm_new_password"
              type="password"
              className="disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Confirm New Password"
              required
              disabled={!open}
            />
          </div>
          <Button
            variant={"default"}
            type="submit"
            className="w-full hover:cursor-pointer text-white mt-3  disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!open}
          >
            Reset
          </Button>
          {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Login with GitHub
        </Button> */}
        </div>
        {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
      </form>
    </>
  );
}

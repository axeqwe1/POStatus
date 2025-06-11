import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh sm:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            NDS Coporate Backoffice.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted hidden relative sm:flex ">
        <div className="z-10 absolute inset-0 w-full h-full bg-gradient-to-br from-red-100 to-red-500 opacity-50"></div>
        <img
          src="/background-coporate-transparent.png"
          alt="Image"
          className="z-30 my-auto dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

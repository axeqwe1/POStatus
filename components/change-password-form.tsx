"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useRouter } from "next/navigation";
import { log } from "console";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useAuth } from "@/context/authContext";
import { changePasswordUser } from "@/lib/api/user";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ChangePasswordFormProps extends React.ComponentProps<"form"> {
  className?: string;
  userId?: string; // Optional userId prop if needed
}
const formSchema = z
  .object({
    oldpassword: z.string().min(1, "Please enter old password").max(50),
    newpassword: z.string().min(1, "Please enter new password").max(50),
    confirmnewpassword: z
      .string()
      .min(1, "Please enter confirm new password")
      .max(50),
  })
  .refine((data) => data.newpassword === data.confirmnewpassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmnewpassword"], // ชี้ให้ error ไปอยู่ field confirm
  });

export function ChangePasswordForm({
  className,
  userId,
  ...props
}: ChangePasswordFormProps) {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldpassword: "",
      newpassword: "",
      confirmnewpassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const res = await changePasswordUser(
        userId ? parseInt(userId) : 0, // Ensure userId is a number
        values.newpassword,
        values.oldpassword
      );
      console.log(res);
      if (res != null && res.status === 200) {
        toast.success("Password changed successfully!");
        router.back();
        // Handle successful login, e.g., redirect to dashboard or home page
      } else {
        // Handle error, e.g., show error message
        if (res != null && res.status === 401) {
          setErrorMessage("Invalid username or password. Please try again.");
          setIsError(true);
        } else if (res != null && res.status === 500) {
          setErrorMessage("Server error. Please try again later.");
          setIsError(true);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          setIsError(true);
        }
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      setErrorMessage(error.response?.data || "Failed to change password");
      setIsError(true);
    }
  };

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  const handleDialogOpen = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      console.log("Form is valid, opening dialog");
      setOpenDialog(true);
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Change Password</h1>
            {/* <p className="text-muted-foreground text-sm text-balance">
            Change Password
          </p> */}
          </div>
          {isError && (
            <Alert className="text-red-500 text-sm bg-red-200">
              <AlertTitle>
                <span className="font-semibold">Login Failed!</span>
              </AlertTitle>
              <AlertDescription className="text-red-500 text-sm text-center">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-3">
            <div className="grid gap-3">
              {/* <Label htmlFor="username">Old Password</Label>
              <Input
                id="oldpassword"
                type="password"
                placeholder="Old password"
                required
              /> */}
              <FormField
                control={form.control}
                name="oldpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Old password"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription></FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="newpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription></FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="confirmnewpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription></FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <Button
          variant={"default"}
          className="w-full hover:cursor-pointer text-white mt-5"
          onClick={handleDialogOpen}
        >
          Change Password
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently update your
              account and update your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={"default"}
                className="hover:cursor-pointer text-white"
                onClick={() => formRef.current?.requestSubmit()}
              >
                Submit
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/datatype";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
interface ProductFormProps extends React.ComponentProps<"form"> {
  product?: Product;
  onSuccess?: () => void; // ✅ เพิ่ม
}

// await toast.promise(
//   axios.post("/api/save", data).then((res) => res.data),
//   {
//     loading: "Saving...",
//     success: (response) => `Saved: ${response.message}`,
//     error: (err) => {
//       const message = err.response?.data?.message || err.message;
//       return `Error: ${message}`;
//     },
//   }
// );

export function ProductForm({
  className,
  product,
  onSuccess, // ✅ รับ callback
}: ProductFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(formRef.current!);
    const formDataObj = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
    };
    console.log(formDataObj);
    // ลองใส่ delay จำลองการ save
    // setTimeout(() => {
    //   toast.success("Product updated successfully!");
    //   onSuccess?.(); // ✅ เรียก callback เพื่อปิด Dialog/Drawer
    // }, 500);

    // await toast.promise(
    //   new Promise((resolve) => setTimeout(resolve, 1000)), // // async function
    //   {
    //     loading: "saving...",
    //     success: "update success 🎉",
    //     error: "error",
    //   }
    // );

    let errormessage = "";
    const result = await toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Failed to save"));
        }, 1000);
      }),
      {
        loading: "Saving...",
        success: "Success",
        error: (err) => {
          // รับ error object จาก reject
          errormessage = err.message; // เก็บ message ในตัวแปร (ถ้าต้องการใช้ที่อื่น)
          return `Error: ${err.message}`; // แสดง message ใน toast
        },
      }
    );

    // จะไม่ถึงตรงนี้ เพราะจะ throw error
    console.log(result);

    onSuccess?.();
  };
  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={cn("grid items-start gap-6", className)}
      >
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name ?? ""} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            defaultValue={product?.description ?? ""}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            defaultValue={product?.price ?? 0}
          />
        </div>
      </form>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full hover:cursor-pointer">Save</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to update?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently update your
              product and update your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                className="hover:cursor-pointer"
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

// export function ProductForm({
//   className,
//   product,
// }: React.ComponentProps<"form"> & { product?: Product | null }) {
//   return (
//     <form className={cn("grid items-start gap-6", className)}>
//       <div className="grid gap-3">
//         <Label htmlFor="name">Name</Label>
//         <Input id="name" defaultValue={product?.name ?? ""} />
//       </div>
//       <div className="grid gap-3">
//         <Label htmlFor="description">Description</Label>
//         <Input id="description" defaultValue={product?.description ?? ""} />
//       </div>
//       <div className="grid gap-3">
//         <Label htmlFor="price">Price</Label>
//         <Input id="price" type="number" defaultValue={product?.price ?? 0} />
//       </div>
//       <Button type="submit">Save</Button>
//     </form>
//   );
// }

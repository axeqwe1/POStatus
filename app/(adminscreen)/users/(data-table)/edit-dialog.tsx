"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { InputDropdown } from "@/components/ui/inputDropdown";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, User } from "@/types/datatype";
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
import supplier, { getSuppliers } from "@/lib/api/supplier";
import { useEffect, useState } from "react";
import { getRoleAll } from "@/lib/api/role";
import { updateUser } from "@/lib/api/user";
interface UserFormProps extends React.ComponentProps<"form"> {
  user?: User;
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

export function UserForm({
  className,
  user,
  onSuccess, // ✅ รับ callback
}: UserFormProps) {
  const [valueSupplier, setValueSupplier] = useState("");
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [valueRole, setValueRole] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(formRef.current!);
    const password = formData.get("password");
    const updatePayload: any = {
      Username: formData.get("username"),
      FirstName: formData.get("firstName"),
      LastName: formData.get("lastName"),
      Email: formData.get("email"),
      RoleName: valueRole,
      SupplierId: valueSupplier, // ถ้า backend ไม่ใช้ก็ลบออก
    };

    if (password) {
      updatePayload.Password = password; // ใส่ password เฉพาะตอนมีการกรอกใหม่
    }

    console.log(updatePayload);

    let errormessage = "";
    const result = await toast.promise(
      new Promise((resolve, reject) => {
        if (user != null) {
          const updateRequest = { updatePayload };
          updateUser(user?.userId, updatePayload)
            .then((res) => {
              console.log(res);
              onSuccess?.();
              resolve("Update Success");
            })
            .catch((error) => {
              onSuccess?.();
              reject(new Error(error));
            });
        } else {
          onSuccess?.();
          reject(new Error("Not Found UserId"));
        }
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
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await getSuppliers();
        const supplierData = res.data.data.map(
          (supplier: any) => supplier.supplierCode
        );

        setSuppliers(
          res.data.data.map((supplier: any) => supplier.supplierCode)
        ); // Assuming the API returns an array of suppliers with a 'name' property
        if (user?.supplierCode) {
          console.log(supplierData);
          setValueSupplier(
            supplierData.find(
              (supplier: any) => supplier === user.supplierCode
            ) || ""
          );
        }
        if (res.status !== 200) {
          throw new Error("Failed to fetch suppliers");
        }
        return res;
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error; // Re-throw the error for further handling if needed
      }
    };

    const fetchRole = async () => {
      try {
        const res = await getRoleAll();
        // console.log(res.data.map((role: any) => role.name));
        setRoles(res.data.map((role: any) => role.roleName)); // Assuming the API returns an array of roles with a 'name' property
        if (user?.roleId) {
          setValueRole(
            res.data.find((role: any) => role.roleId === user.roleId)
              ?.roleName || ""
          );
        }
        if (res.status !== 200) {
          throw new Error("Failed to fetch roles");
        }
        return res;
      } catch (error) {
        console.error("Error fetching roles:", error);
        throw error; // Re-throw the error for further handling if needed
      }
    };
    fetchSupplier();
    fetchRole();
  }, [user]);
  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={cn("grid items-start gap-3", className)}
      >
        <div className="grid gap-3">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label className="pb-1" htmlFor="firstName">
                Firstname
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                defaultValue={user?.firstName ?? 0}
              />
            </div>
            <div>
              <Label className="pb-1" htmlFor="lastName">
                Lastname
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                defaultValue={user?.lastName ?? 0}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          <div className="grid gap-1">
            <Label className="pb-1" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="text"
              defaultValue={user?.email ?? ""}
            />
          </div>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label className="pb-1" htmlFor="selectRole">
                Role
              </Label>
              <InputDropdown
                options={roles}
                value={valueRole}
                onChange={setValueRole}
                placeholder="Select Role"
                className="max-w-sm"
                inputClassName="p-3"
                dropdownClassName=" border-blue-400"
                optionClassName="hover:bg-blue-600 hover:text-white"
              />
            </div>
            <div className="grid gap-1">
              <Label className="pb-1" htmlFor="selectRole">
                Supplier
              </Label>
              <InputDropdown
                options={suppliers}
                value={valueSupplier}
                onChange={setValueSupplier}
                placeholder="Select Supplier"
                className="max-w-sm"
                inputClassName="p-3"
                dropdownClassName=" border-blue-400"
                optionClassName="hover:bg-blue-600 hover:text-white"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="username">
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            defaultValue={user?.username ?? ""}
          />
        </div>
        <div className="grid gap-1">
          <Label className="pb-1" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Leave blank to keep current password"
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

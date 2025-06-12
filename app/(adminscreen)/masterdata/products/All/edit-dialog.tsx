"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/datatype";

interface ProfileFormProps extends React.ComponentProps<"form"> {
  product?: Product;
}

export function ProductForm({
  className,
  product,
}: React.ComponentProps<"form"> & { product?: Product | null }) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={product?.name ?? ""} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Input id="description" defaultValue={product?.description ?? ""} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" defaultValue={product?.price ?? 0} />
      </div>
      <Button type="submit">Save</Button>
    </form>
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

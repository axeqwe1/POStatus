"use client";
import { useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns, getSubColumns } from "./columns";
import { Product, Variant } from "@/types/datatype";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer } from "vaul";
import { ProductForm } from "./edit-dialog";

interface DataTableProps {
  data: Product[];
}
export default function DataTable({ data }: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [subDatas, setSubDatas] = useState<Variant[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [editItem, setEditItem] = useState<Product | Variant | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleDelete = (id: string) => {
    setDatas((prev) => prev.filter((u) => u.id !== id));
  };
  const handleDeleteSubdata = (id: string) => {
    setSubDatas((prev) => prev.filter((u) => u.id !== id));
  };
  const handleEdit = (id: boolean) => {
    setIsEdit(id);
  };
  function isProduct(item: Product | Variant | null): item is Product {
    return item !== null && "category" in item && "price" in item;
  }
  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    setEditItem,
    isDesktop
  );
  const subColumns = getSubColumns(handleDeleteSubdata);
  const findSubtableData = (rowId: string) => {
    console.log("findSubtableData", rowId);
    // datas.find((item) => item.id === rowId);
    datas.find((item) => {
      if (item.id === rowId) {
        setSubDatas(item.variants || []);
        return true;
      }
      return false;
    });
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <CustomDataTable<Product, Variant>
          className="rounded-lg border"
          data={datas}
          columns={columns}
          collapse={true}
          findSubtableData={findSubtableData}
          subtableData={subDatas}
          subColumns={subColumns}
        />
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
      {isDesktop ? (
        <Dialog
          open={!!editItem}
          onOpenChange={(open) =>
            !open && setEditItem ? setEditItem(null) : {}
          }
        >
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Edit your product below.</DialogDescription>
            </DialogHeader>
            <ProductForm product={isProduct(editItem) ? editItem : undefined} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root
          open={!!editItem}
          onOpenChange={(open) =>
            !open && setEditItem ? setEditItem(null) : {}
          }
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Product</DrawerTitle>
              <DrawerDescription>Edit your product below.</DrawerDescription>
            </DrawerHeader>
            {isProduct(editItem) ? (
              <ProductForm
                product={isProduct(editItem) ? editItem : undefined}
                className="px-4"
              />
            ) : (
              <>
                <div className="flex">test</div>
              </>
            )}

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer.Root>
      )}
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns } from "./columns";
import { PO_Status, Product, User, Variant } from "@/types/datatype";
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
import { json } from "stream/consumers";
import { UserForm } from "./edit-dialog";

interface DataTableProps {
  data: User[];
  onSuccess: () => void;
}
export default function DataTable({ data, onSuccess }: DataTableProps) {
  const [datas, setDatas] = useState<User[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const [editItem, setEditItem] = useState<User | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleDelete = (id: number) => {
    setDatas((prev) => prev.filter((u) => u.userId !== id));
  };
  const handleEdit = (id: boolean) => {
    setIsEdit(id);
  };
  useEffect(() => {
    setDatas(data);
  }, [data]);
  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    setEditItem,
    isDesktop
  );
  const RefreshonSuccess = () => {
    onSuccess?.();
  };
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <CustomDataTable<User, null>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={false}
        />
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
      {isDesktop ? (
        <Dialog
          // shorthand !! is convert to boolean in condition: true if has data, false if not has data
          open={!!editItem}
          onOpenChange={(open) =>
            !open && setEditItem ? setEditItem(null) : {}
          }
        >
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Edit your user below.</DialogDescription>
            </DialogHeader>
            <UserForm
              onSuccess={() => {
                setEditItem(null);
                console.log("trigger userform");
                RefreshonSuccess();
              }} // ✅ เพิ่มตรงนี้
              user={editItem ? editItem : undefined}
            />
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
              <DrawerTitle>Edit User</DrawerTitle>
              <DrawerDescription>Edit your user below.</DrawerDescription>
            </DrawerHeader>
            {editItem ? (
              <UserForm
                user={editItem ? editItem : undefined}
                onSuccess={() => {
                  setEditItem(null);
                  console.log("trigger userform");
                  RefreshonSuccess();
                }} // ✅ เพิ่มตรงนี้
                className="overflow-y-auto px-4 pb-6 flex-1"
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

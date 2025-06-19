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
import { deleteUser } from "@/lib/api/user";

interface DataTableProps {
  data: User[];
  onSuccess: () => void;
}
export default function DataTable({ data, onSuccess }: DataTableProps) {
  const [datas, setDatas] = useState<User[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const RefreshonSuccess = () => {
    onSuccess?.();
  };
  const handleDelete = async (id: number) => {
    const res = await deleteUser(id);
    if (res.status === 200) {
      RefreshonSuccess();
    }
  };

  const setOpenModal = (isOpen: boolean) => {
    console.log(isOpen);
    setIsOpenModal(isOpen);
  };

  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    setEditItem,
    isDesktop
  );

  useEffect(() => {
    if (!isEdit) {
      setEditItem(null);
    }
  }, [isEdit]);
  useEffect(() => {
    setDatas(data);
  }, [data]);
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <CustomDataTable<User, null>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={false}
          setOpenModal={setOpenModal}
        />
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
      {isDesktop ? (
        <Dialog
          // shorthand !! is convert to boolean in condition: true if has data, false if not has data
          open={isOpenModal || isEdit}
          onOpenChange={(open) => {
            // !open && setEditItem ? setEditItem(null) : {};
            // !open ? setOpenModal(false) : {};
            if (!open) {
              setOpenModal(false);
              setIsEdit(false);
            }
          }}
        >
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>{!!isEdit ? "Edit User" : "Add User"}</DialogTitle>
              <DialogDescription>Edit your user below.</DialogDescription>
            </DialogHeader>
            <UserForm
              onSuccess={() => {
                setEditItem(null);
                setIsOpenModal(false);
                setIsEdit(false);
                console.log("trigger userform");
                RefreshonSuccess();
              }} // ✅ เพิ่มตรงนี้
              data={editItem ? editItem : undefined}
              isEdit={isEdit}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root
          open={isOpenModal || isEdit}
          onOpenChange={(open) => {
            if (!open) {
              setOpenModal(false);
              setIsEdit(false);
            }
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{isEdit ? "Edit User" : "Add User"}</DrawerTitle>
              <DrawerDescription>Edit your user below.</DrawerDescription>
            </DrawerHeader>
            {isOpenModal || isEdit ? (
              <UserForm
                data={editItem ? editItem : undefined}
                isEdit={isEdit}
                onSuccess={() => {
                  setEditItem(null);
                  setIsOpenModal(false);
                  setIsEdit(false);
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

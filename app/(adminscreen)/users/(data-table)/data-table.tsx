"use client";
import { useEffect, useRef, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns, getSubColumns } from "./columns";
import { PO_Status, Product, User, UserEmail, Variant } from "@/types/datatype";
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
import { deleteUser, getEmail, setActiveEmail } from "@/lib/api/user";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

interface DataTableProps {
  data: User[];
  onSuccess: () => void;
}
export default function DataTable({ data, onSuccess }: DataTableProps) {
  const [datas, setDatas] = useState<User[]>([]);
  const [subDatas, setSubDatas] = useState<UserEmail[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const IdRef = useRef<number>(0);
  const RefreshonSuccess = () => {
    onSuccess?.();
  };
  const handleDelete = async (id: number) => {
    const res = await deleteUser(id);
    if (res.status === 200) {
      toast.success("Delete Success");
      RefreshonSuccess();
    } else {
      toast.success("Something weng wrong");
    }
  };

  const setOpenModal = (isOpen: boolean) => {
    console.log(isOpen);
    setIsOpenModal(isOpen);
  };
  const setActive = async (emailId: string, bool: boolean) => {
    const res = await setActiveEmail(emailId, bool);

    if (res.success) {
      findSubtableData(IdRef.current);
      toast.success(`Set ${bool ? "Active" : "Deactive"} Success`);
    }
  };
  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    setEditItem,
    isDesktop
  );
  const subColumns = getSubColumns(setActive);
  const findSubtableData = async (rowId: any) => {
    setSubDatas([]);
    try {
      console.log("findSubtable", rowId);
      const res = await getEmail(rowId);
      IdRef.current = rowId;
      setSubDatas(res.data);
      console.log(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (!isEdit) {
      setEditItem(null);
    }
  }, [isEdit]);

  useEffect(() => {
    // console.log(data);
    // console.log(user);
    // if (user?.role == "Admin") {
    //   let filterSupp = data.filter(
    //     (item) => item.supplierCode == user.supplierId && item.roleId !== 1
    //   );
    //   setDatas(filterSupp);
    // } else {
    //   setDatas(data);
    // }
    setDatas(data);
  }, [data]);
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <CustomDataTable<User, UserEmail>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={true}
          setOpenModal={setOpenModal}
          showAddBtn={true}
          subColumns={subColumns}
          subtableData={subDatas}
          findSubtableData={findSubtableData}
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

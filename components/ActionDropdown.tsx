"use client";
import { Models } from "node-appwrite";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { ACTION_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionItem } from "@/lib/types";
import { Input } from "./ui/input";
import ButtonWithLoading from "./ButtonWithLoading";
import { deleteFile, renameFile, shareFile } from "@/lib/appwrite/file.actions";
import { usePathname } from "next/navigation";
import FileDetails from "./FileDetails";
import Share from "./Share";

const ActionDropdown = ({ file }: { file: Models.DefaultRow }) => {
  const path = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionListOpen, setIsActionListOpen] = useState(false);
  const [actionItem, setActionItem] = useState<ActionItem | null>(null);
  const [fileName, setFileName] = useState(file.name);
  const [loading,setLoading] = useState(false);
  const [emails,setEmails] = useState([""]);

  const handleCloseAllModals = () => {
    setIsModalOpen(false);
    setIsActionListOpen(false);
    setFileName(file.name);
    setActionItem(null);
    setEmails([""]);
  };

  const handleAction = async() => {
    if(!actionItem) {
        return;
    }

    setLoading(true);
    let success = false;

    const actions = {
        rename:()=> {
          return renameFile({
            fileId:file.$id,
            name:fileName,
            extension:file.extension,
            path
          })
        },
        share:()=> {
          return shareFile({
            fieldId:file.$id,
            emails,
            path
          })
        },
        delete:()=> {
          return deleteFile({
            fileId:file.$id,
            bucketFileId:file.bucketFileId,
            path
          })
        }
    }
    success = await actions[actionItem.value as  keyof typeof actions]();
    if(success) {
      handleCloseAllModals();
    }
    setLoading(false);
  }

  const renderDialogContent = () => {
    if (!isModalOpen) {
      return null;
    }
    const { label,value = "" } = actionItem || {};
    return (
      <DialogContent className="rounded-2xl w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-center text-gray-600">{label}</DialogTitle>

          {value === 'rename' && <Input type="text" value={fileName} onChange={(e) => setFileName(e.target.value) }/>}

          {value === 'details' && <FileDetails file={file}/>}
          {value === 'share' && <Share file={file} onEmailChange={setEmails}/>}
          {value === 'delete' && <p className="text-center text-gray-700">Are you sure to delete file <span className="font-medium text-froly">{file.name}</span>?. <b>This action is irreversible!</b> </p>}
          {["rename","delete","share"].includes(value) && 
          <DialogFooter className="flex items-center justify-between mt-2">
            <button className="cursor-pointer flex-1 h-11 rounded-full shadow hover:bg-gray-100" onClick={handleCloseAllModals}>Cancel</button>
            <ButtonWithLoading loading={loading} label={label} onClick={handleAction} classNames="rounded-full p-0 h-11 mt-0 flex-1"/>
            </DialogFooter>}
        </DialogHeader>
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isActionListOpen} onOpenChange={setIsActionListOpen}>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="text-gray-600" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-52 border-none rounded-xl">
          <DropdownMenuLabel className="text-base font-medium w-56 truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div>
            {ACTION_ITEMS.map((item) => {
              const {
                label,
                value,
                icon: Icon,
                iconColor,
                iconBgColor,
              } = item || {};
              return (
                <DropdownMenuItem
                  key={value}
                  className="text-base mt-2 cursor-pointer"
                  onClick={() => {
                    if (
                      ["rename", "share", "delete", "details"].includes(value)
                    ) {
                      setActionItem(item);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  {value === "download" ? (
                    <Link
                      href={constructDownloadUrl(file.bucketFileId)}
                      className="flex items-center gap-2 w-full"
                    >
                      <div
                        className={`${iconBgColor} w-8 h-8 flex items-center justify-center rounded-full`}
                      >
                        <Icon className={`${iconColor} w-5 h-5`} />
                      </div>
                      {label}
                    </Link>
                  ) : (
                    <div className="w-full flex items-center gap-2">
                      <div
                        className={`${iconBgColor} w-8 h-8 flex items-center justify-center rounded-full`}
                      >
                        <Icon className={iconColor} />
                      </div>
                      {label}
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}{" "}
            {/* ← ini yang kurang */}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;

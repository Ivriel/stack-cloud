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
      <DialogContent className="rounded-2xl p-0 overflow-hidden sm:max-w-md">
        <div className="overflow-y-auto max-h-[85vh] p-6 flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-center text-gray-600">{label}</DialogTitle>
          </DialogHeader>

          {value === 'rename' && (
            <Input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && <Share file={file} onEmailChange={setEmails} />}
          {value === 'delete' && (
            <p className="text-center text-gray-700 text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-froly">{file.name}</span>?{" "}
              <b>This action is irreversible!</b>
            </p>
          )}

          {["rename", "delete", "share"].includes(value) && (
            <DialogFooter className="flex-row gap-3 pt-2">
              <button
                className="flex-1 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer transition-colors"
                onClick={handleCloseAllModals}
              >
                Cancel
              </button>
              <button
                className="flex-1 h-11 rounded-full bg-froly hover:bg-froly/90 text-white text-sm font-medium cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleAction}
                disabled={loading}
              >
                {label}
                {loading && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                )}
              </button>
            </DialogFooter>
          )}
        </div>
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

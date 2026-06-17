"use client";
import { Models } from "node-appwrite";
import FilePreview from "./FilePreview";
import { cn, formatDateTime, getFileSize } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { getFileOwnerDetails } from "@/lib/appwrite/file.actions";

const FileDetails = ({ file }: { file: Models.DefaultRow }) => {
    const [ownerFullName,setOwnerFullName] = useState("");
    const [ownerEmail,setOwnerEmail] = useState("");
    const handleFetchOwnerDetails = useCallback(async()=> {
       const user = await getFileOwnerDetails(file.ownerId);
       console.log("owner user:",user)
       setOwnerFullName(user.fullName);
       setOwnerEmail(user.email);
    },[file.ownerId])

    useEffect(()=> {
        handleFetchOwnerDetails();
    },[handleFetchOwnerDetails])

  const renderItem = (label: string, value: string | number) => {
    return (
      <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-400 text-sm w-28 shrink-0">{label}</span>
        <span className="text-gray-700 text-sm font-medium break-all">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-w-0">
      <FilePreview file={file} />
      <div className="mt-3">
        {renderItem("Type", file.extension)}
        {renderItem("Size", getFileSize(file.size))}
        {renderItem("Creator", ownerFullName)}
        {renderItem("Creator Email", ownerEmail)}
        {renderItem("Created", formatDateTime(file.$createdAt))}
        {renderItem("Modified", formatDateTime(file.$updatedAt))}
      </div>
    </div>
  );
};

export default FileDetails;

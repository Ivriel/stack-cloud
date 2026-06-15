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
    // const upperCaseClass = label === "Creator" ? "" : "uppercase"
    return (
      <div className="mt-4 flex gap-6">
        <span className="text-gray-500 font-medium w-20">{label}:</span>
        <span className="font-medium text-gray-700">{value}</span>
      </div>
    );
  };

  return (
    <div>
      <FilePreview file={file} />
      {renderItem("Type", file.extension)}
      {renderItem("Size", getFileSize(file.size))}
      {renderItem("Creator", ownerFullName)}
      {renderItem("Creator Email", ownerEmail)}
      {renderItem("Created", formatDateTime(file.$createdAt))}
      {renderItem("Modified", formatDateTime(file.$updatedAt))}
      

    </div>
  );
};

export default FileDetails;

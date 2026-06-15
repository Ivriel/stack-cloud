"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { UploadCloudIcon, X } from "lucide-react";
import Preview from "./Preview";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { toast } from "sonner";
import { uploadFile } from "@/lib/appwrite/file.actions";
import { usePathname } from "next/navigation";

const FileUploader = ({ownerId,accountId}:{ownerId:string;accountId:string}) => {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname()

  const handleFilterFiles = useCallback((fileName:string) => {
    const filteredFiles = files.filter((file) => file.name !== fileName);
        setFiles(filteredFiles); 
  },[files])
  const onDrop = useCallback(async(acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const uploadedFiles = acceptedFiles.map(async(file) => {
      // kalau gabisa upload
      if(file.size > MAX_FILE_SIZE) {
        handleFilterFiles(file.name);
        toast.error(`Failed to upload ${file.name}`,{description:(
          <span className="text-black">
            <span className="font-semibold">{file.name} is to large. Max File Size is 50MB</span>
          </span>
        ),
      });
      return;
      }
      //upload file
      return uploadFile({file,ownerId,accountId,path}).then((uploadedFile) => {
        if(uploadedFile){
            handleFilterFiles(file.name)
        }
      })
    });
    await Promise.all(uploadedFiles)
  }, [accountId,handleFilterFiles,ownerId,path]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
 
  const handleRemoveFile = (e:React.MouseEvent<HTMLSpanElement,MouseEvent>,fileName:string) => {
    e.stopPropagation();
    handleFilterFiles(fileName)
  }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button className="rounded-xl px-6 py-5 gap-1.5 cursor-pointer flex items-center justify-center bg-froly hover:bg-froly/90">
        <UploadCloudIcon className="h-6! w-6!" />
        <span className="text-base">Upload</span>
      </Button>
      {files.length > 0 && (
        <ul className="absolute right-10 bottom-15 bg-white w-96 shadow p-4 rounded-2xl">
          <span className="font-medium text-gray-600">Uploading</span>
          {files.map((file, index) => {

            const {type,extension} = getFileType(file.name)

            return (
              <li key={index}>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Preview type={type} extension={extension} url={convertFileToUrl(file)} classNames="w-15 h-15" imgClassNames="h-10 w-10"/>
                    <div className="flex flex-col gap-1.5 w-52">
                      <span className="text-sm font-medium truncate">{file.name}</span>
                      {/* indeterminate shimmer bar */}
                      <div className="relative h-1.5 w-full rounded-full bg-froly/20 overflow-hidden">
                        <div
                          className="absolute inset-y-0 w-2/5 rounded-full"
                          style={{
                            background: "linear-gradient(90deg, transparent 0%, #f57799 40%, #ff99b8 60%, transparent 100%)",
                            animation: "shimmer 1.4s ease-in-out infinite",
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 tracking-wide">Uploading…</span>
                    </div>
                  </div>
                    <div className="bg-gray-400 p-0.5 cursor-pointer rounded-full" onClick={(e) =>handleRemoveFile(e,file.name)}>
                        <X className="text-white w-4 h-4"/>
                    </div>
                    </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;

"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { UploadCloudIcon, UploadIcon, X } from "lucide-react";
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
                    <div className="flex flex-col">
                      <span className="w-60 truncate">{file.name}</span>
                      <iframe
                        className="h-8 flex items-start justify-start w-48 -ml-5"
                        src="
                    https://lottie.host/embed/8e243216-618c-4f4a-bb6a-a47b0b15e206/08YzV1Qi2b.lottie
"
                      ></iframe>
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

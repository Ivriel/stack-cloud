"use client";
import FileCard from "@/components/FileCard";
import { getFiles } from "@/lib/appwrite/file.actions";
import { FILE_CARDS } from "@/lib/constants";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown } from "lucide-react";
import { Models } from "node-appwrite";
import Preview from "@/components/Preview";
import { formatDateTime, getFileSize, getFileType } from "@/lib/utils";
import ActionDropdown from "@/components/ActionDropdown";

const Dashboard = () => {
  const [allFiles, setAllFiles] = useState([]);
  const handleFetchFiles = async () => {
    const allFiles = await getFiles({ types: [], query: "" });
    setAllFiles(allFiles.rows);
  };

  useEffect(() => {
    handleFetchFiles();
  }, []);

  return (
    <div className="px-8 mt-7">
      <div className="flex items-center justify-between gap-8">
        {FILE_CARDS.map((card) => {
          const { id, bgColor, imgSrc, title } = card || {};
          return (
            <FileCard
              key={card.id}
              id={id}
              bgColor={bgColor}
              imgSrc={imgSrc}
              title={title}
              allFiles={allFiles}
            />
          );
        })}
      </div>

      <h1 className="text-gray-700 text-2xl font-medium mt-12">Recent Files</h1>

      <Table className="mt-2">
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            <TableHead className="text-gray-500 text-base font-medium">
              Name
            </TableHead>
            <TableHead className="text-gray-500 text-base font-medium">
              Last Modified
            </TableHead>
            <TableHead className="text-gray-500 text-base font-medium">
              Size
            </TableHead>
            <TableHead className="text-gray-500 text-base font-medium text-right">
              Type
            </TableHead>
            <TableHead className="text-gray-500 text-right text-base font-medium fles justify-end items-center">
              <ArrowDown className="h-5 w-5" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allFiles.slice(0, 7).map((file: Models.DefaultRow) => {
            return (
              <TableRow key={file.$id} className="border-b-0">
                <TableCell className="font-medium flex items-center gap-4">
                  <Preview
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    classNames="w-10 h-10"
                    imgClassNames="w-6 h-6"
                  />
                  <span className="font-medium text-gray-800">{file.name}</span>
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                  {formatDateTime(file.$updatedAt)}
                </TableCell>
                <TableCell className="font-medium text-gray-800">
                  {getFileSize(file.size)}
                </TableCell>
                <TableCell className="text-right font-medium text-gray-800">
                  {getFileType(file.name).type}
                </TableCell>
                <TableCell className="flex justify-end font-medium text-gray-800 cursor-pointer">
                  <ActionDropdown file={file} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;

"use client";
import FileCard from "@/components/FileCard";
import { getFiles } from "@/lib/appwrite/file.actions";
import { FILE_CARDS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { Models } from "node-appwrite";
import Preview from "@/components/Preview";
import { formatDateTime, getFileSize, getFileType } from "@/lib/utils";
import ActionDropdown from "@/components/ActionDropdown";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [allFiles, setAllFiles] = useState<Models.DefaultRow[]>([]);

  const handleFetchFiles = async () => {
    const res = await getFiles({ types: [], query: "" });
    setAllFiles(res.rows);
  };

  useEffect(() => {
    handleFetchFiles();
  }, []);

  return (
    <div className="px-6 py-7">
      {/* File cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FILE_CARDS.map((card) => (
          <FileCard
            key={card.id}
            id={card.id}
            bgColor={card.bgColor}
            imgSrc={card.imgSrc}
            title={card.title}
            allFiles={allFiles}
          />
        ))}
      </div>

      {/* Recent Files table */}
      <div className="mt-10">
        <h2 className="text-gray-700 text-xl font-semibold mb-4">Recent Files</h2>

        <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-gray-400 font-medium px-4 py-3 w-[45%]">Name</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3 hidden sm:table-cell">Last Modified</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3 hidden md:table-cell">Size</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Shared</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3 hidden lg:table-cell">Type</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {allFiles.slice(0, 10).map((file, i) => {
                const sharedWith: string[] = Array.isArray(file.users) ? file.users.filter(Boolean) : [];
                const shareCount = sharedWith.length;

                return (
                  <tr
                    key={file.$id}
                    className={cn(
                      "group hover:bg-froly/5 transition-colors",
                      i !== 0 && "border-t border-gray-100"
                    )}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Preview
                          type={file.type}
                          extension={file.extension}
                          url={file.url}
                          classNames="w-10 h-10 shrink-0"
                          imgClassNames="w-6 h-6"
                        />
                        <span className="font-medium text-gray-800 truncate max-w-[160px] sm:max-w-[220px] md:max-w-xs">
                          {file.name}
                        </span>
                      </div>
                    </td>

                    {/* Last Modified */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {formatDateTime(file.$updatedAt)}
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {getFileSize(file.size)}
                    </td>

                    {/* Shared with */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {shareCount > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* Avatar stack — show up to 3 */}
                          <div className="flex -space-x-2">
                            {sharedWith.slice(0, 3).map((email) => (
                              <div
                                key={email}
                                title={email}
                                className="w-7 h-7 rounded-full bg-froly/20 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-froly uppercase"
                              >
                                {email[0]}
                              </div>
                            ))}
                          </div>
                          {/* Count badge */}
                          <span className="text-xs text-gray-500">
                            {shareCount === 1
                              ? "1 person"
                              : `${shareCount} people`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 capitalize">
                        {getFileType(file.name).type}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <ActionDropdown file={file} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {allFiles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No files yet. Upload something to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

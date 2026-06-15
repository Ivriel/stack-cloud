"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from ".";
import { appwriteConfig } from "./appwriteConfig";
import { constructFileUrl, getFileType, parseObj } from "../utils";
import { error } from "console";
import { revalidatePath } from "next/cache";

// upload File
/* file , owner Id,accountId,path */
// storage and datababses => create admin client
// creaate the file in the storage -> bucked Id, file Id, file
// file document => metaadata for the uploaded file
// create a new row in the database -> daatabseId,tableId,rowId,data(file)
// revalidatePath(path)

export const uploadFile = async ({file,ownerId,accountId,path}:{
    file:File;
    ownerId:string;
    accountId:string;
    path:string
}) => {
    const {storage,databases} = await createAdminClient();

    try {
        const bucketFile = await storage.createFile({
            bucketId:appwriteConfig.bucketId,
            fileId:ID.unique(),
            file
        })

        const fileDocument = {
            type:getFileType(bucketFile.name).type,
            name:bucketFile.name,
            url:constructFileUrl(bucketFile.$id),
            extension:getFileType(bucketFile.name).extension,
            size:bucketFile.sizeOriginal,
            owner:ownerId,
            accountId,
            users: [],
            bucketFileId:bucketFile.$id
        }

        const newFile = await databases.createRow({
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.filesCollectionId,
            rowId:ID.unique(),
            data:fileDocument
        }).catch(async(error:unknown) => {
            await storage.deleteFile({
                bucketId:appwriteConfig.bucketId,
                fileId:bucketFile.$id
            });
            console.error("Failed to create file",error)
        });

        revalidatePath(path);

        return parseObj(newFile)
    } catch (error) {
        console.error("Failed to upload file:",error)
    }
}
"use server";

import { ID, Models, Query } from "node-appwrite";
import { createAdminClient } from ".";
import { appwriteConfig } from "./appwriteConfig";
import { constructFileUrl, getFileType, parseObj } from "../utils";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";
import { RenameFile } from "../types";

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
            owner:[ownerId],
            accountId,
            users: [],
            bucketFileId:bucketFile.$id,
            ownerId
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

const createQueries = (currentUser:Models.DefaultRow,types:string[],query:string,filter:string) => {
    const queries = [
        Query.or([
            Query.equal("ownerId",[currentUser.$id]),
            Query.contains("users",[currentUser.email])
        ])
    ]
    // types query and filter.
    if(types.length > 0) {
        queries.push(Query.equal("type",types))
    }
    return queries;
}


export const getFiles = async({types = [],query,filter = "$createdAt-asc"}:{types:string[];query:string;filter?:string;})=> {
    const {databases} = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) {
            console.log("User not found");
            return;
        }
        const queries = createQueries(currentUser,types,query,filter);
        const files = await databases.listRows({
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.filesCollectionId,
            queries
        });
        return parseObj(files)
    } catch (error) {
        console.error("Failed to retrieve file:",error)
    }
}

export const renameFile = async({fileId,name,extension,path}:RenameFile)=> {
   const {databases} = await createAdminClient();

   try {
    const newFileName = `${name}.${extension}`;
    const updatedFile = await databases.updateRow({
        databaseId:appwriteConfig.databaseId,
        tableId:appwriteConfig.filesCollectionId,
        rowId:fileId,
        data:{
            name:newFileName
        }
    });

    revalidatePath(path);
    return parseObj(updatedFile);
   } catch (error) {
      console.error("Failed to rename the file:",error)
   }
}

export const getFileOwnerDetails = async(ownerId:string)=> {
   const {databases} = await createAdminClient();
   try {
    const user = await databases.listRows({
        databaseId:appwriteConfig.databaseId,
        tableId:appwriteConfig.usersCollectionId,
        queries:[Query.equal("$id",ownerId)]
    });

    return user.total > 0 ? parseObj(user.rows[0]) : null;
   } catch (error) {
    console.error("Failed to fetch owner details:",error);
   }
   const user = await databases
}
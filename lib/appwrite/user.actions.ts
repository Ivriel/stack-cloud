"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from ".";
import { appwriteConfig } from "./appwriteConfig";
import { cookies } from "next/headers";
import { USER_ICON } from "../constants";
import { redirect } from "next/navigation";
import { parseObj } from "@/lib/utils";

/* create account (fullname,email)
1. get existing user by email 
2. send the otp to the user email address -> sendEmailOTP(email)
3. if existing user does not exist -> create the user in db with all the data
fullname,email,avatar,accoundId
4. accountId with message
*/

export const getUserByEmail = async(email:string) =>{
    const {databases} = await createAdminClient();
    const result = await databases.listRows({
        databaseId:appwriteConfig.databaseId,
        tableId:appwriteConfig.usersCollectionId,
        queries:[Query.equal("email",[email])]
    });
    
    return result.total > 0 ? result.rows[0] : null;
}

export const sendEmailOTP = async(email:string) => {
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken({
            userId:ID.unique(),
            email
        });
        return session.userId
    } catch (error) {
        console.error("Failed to send email OTP")
    }
}

export const createAccount = async({fullName,email}:{fullName:string;email:string;}) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP(email);

    if(!accountId) {
        return {
            accountId:null,
            message:"Failed to send OTP"
        }
    }

    if(!existingUser) {
        const {databases}  = await createAdminClient()
        await databases.createRow({
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.usersCollectionId,
            rowId:ID.unique(),
            data:{
                fullName,
                email,
                avatar:USER_ICON,
                accountId
            }
        })
    }

    return {accountId,message:"User Created Successfully"}
}

export const signInUser = async(email:string) => {
    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
        return {
            accountId:null,
            message:"Failed to sign in, user doesn't exist"
        }
    }

    const accountId = await sendEmailOTP(email);
    return {
        accountId,
        message:""
    }
}

// verifySecret
// 1. account -> createAdminClient()
// 2. account.createSession()
// 3. store the appwrite-session and appwrite-user-id in the cookie
// 4. return the session id

export const verifySecret = async ({accountId,password}:{accountId:string;password:string;}) => {
    try {
        const {account} = await createAdminClient()
        const session = await account.createSession({
            userId:accountId,
            secret:password
        })

        const cookieStore = await cookies();
        cookieStore.set("appwrite-session",session.$id,{
            path:"/",
            httpOnly:true,
            sameSite:"strict",
            secure:true
        })  
         cookieStore.set("appwrite-user-id",accountId,{
            path:"/",
            httpOnly:true,
            sameSite:"strict",
            secure:true
        })
        
        return {sessionId:session.$id}
    } catch (error) {
        console.error("Failed to verify the OTP",error)
    }
}

// 1.cookie store access -> appwite session -> session ID
//2.call create admin client() => account
// 3. account -> delete the session by passing the id
// 4. clear the cookie -> appwrite session and appwrite user id
export const signOutUser = async() => {
    const cookieStore = await cookies();

    try {
        const sessionId = cookieStore.get("appwrite-session");
        if(sessionId?.value) {
            const {account} = await createAdminClient();

            try {
                await account.deleteSession({sessionId:sessionId.value})
            } catch (error) {
                console.error("Failed to delete the session from appwrite:",error)
            }
        }
    } catch (error) {
        console.error("Error during logout",error);
    } finally {
        cookieStore.delete("appwrite-session");
        cookieStore.delete("appwrite-user-id");
    }

    redirect("/auth");
}

//1.user id from cookie store
//2.create admin client() => databases
// 3. query in the database with the user id and return the user.
export const getCurrentUser = async() => {  
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("appwrite-user-id")

        if(!userId?.value) {
            return null;
        }

        const {databases} = await createAdminClient();
        const user = await databases.listRows({
            databaseId:appwriteConfig.databaseId,
            tableId:appwriteConfig.usersCollectionId,
            queries:[Query.equal("accountId",[userId.value])]
        })

        return user.total > 0 ? parseObj(user.rows[0]) : null;
    } catch (error) {
        console.error("Error while fetching the current user:",error)
        return null;
    }
}
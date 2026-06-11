"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from ".";
import { appwriteConfig } from "./appwriteConfig";
import { cookies } from "next/headers";

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
                avatar:"https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
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
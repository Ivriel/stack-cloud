import Card from "@/components/Card";
import Filter from "@/components/Filter";
import { getFiles } from "@/lib/appwrite/file.actions";
import { getCurrentUser } from "@/lib/appwrite/user.actions";
import { getFileTypeParams, getTotalFileSize } from "@/lib/utils";
import { Models } from "node-appwrite";
import { types } from "util";

const Page = async({
    searchParams,params}:
    {searchParams:Promise<{query:string;filter:string;}>;
    params:Promise<{type:string}>;})=> {


    const type = ((await params)?.type as string) || "";
    const query = ((await searchParams)?.query as string) || "";
    const filter = ((await searchParams)?.filter as string) || "";

    const currentUser = await getCurrentUser();
    const fileType = getFileTypeParams(type);

    const files = await getFiles({types:fileType,query,filter})
    const totalSize = getTotalFileSize(files?.rows)
    console.log("files:",files)


    return <div className="flex flex-col gap-4 px-4 mt-4">
        <div className="flex justify-between">
            <span className="font-semibold text-2xl capitalize">{type}</span>
           <Filter />
        </div>
        <span>Total file size: {totalSize}</span>
        <div className="flex flex-wrap gap-4.5 overflow-y-scroll h-144 no-scrollbar">
            {files?.rows?.map((file:Models.DefaultRow) => {
                return <Card key={file.$id} file={file} fullName={currentUser.fullName}/>
            })}
        </div>
    </div>
}

export default Page;
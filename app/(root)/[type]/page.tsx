const Page = async({
    searchParams,params}:
    {searchParams:Promise<{query:string;filter:string;}>;
    params:Promise<{type:string}>;})=> {


    const type = ((await params)?.type as string) || "";

    return <div>{type}</div>
}

export default Page;
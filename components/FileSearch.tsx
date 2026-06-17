"use client";
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Models } from 'node-appwrite'
import Preview from './Preview';
import { formatDateTime, getFileSize } from '@/lib/utils';
import { getFiles } from '@/lib/appwrite/file.actions';
import { useRouter } from 'next/navigation';

const FileSearch = () => {
    const router = useRouter();
    const [searchResults,setSearchResults] = useState<Models.DefaultRow>()
    const [showSearchResults,setShowSearchResults] = useState(false)
    const [searchText,setSearchText] = useState("")

    const handleFetchSearchFile= async (searchQuery:string) => {
        if(!searchQuery) {
            setShowSearchResults(false);
            return;
        }

        setSearchText(searchQuery);
        const files = await getFiles({types:[],query:searchQuery});
        setSearchResults(files?.rows);
        setShowSearchResults(true);
    }
    const handleSearchItemClick = (file:Models.DefaultRow) => {
        const {type} = file || {};
        const formattedFileType = type === 'audio' || type === 'video' ? "media" : `${type}s`;
        const path = `/${formattedFileType}?query=${searchText}`
        router.push(path);
        setShowSearchResults(false);
    }
    const myDebouncing = <T,>(cb:(value:T) => void,interval:number)=> {
        let timer:ReturnType<typeof setTimeout>;
        return function (value:T) {
            if(timer) {
                clearTimeout(timer)
            }

            timer = setTimeout(() => {
                cb(value)
            }, interval);
        }
    }
    const debounce = myDebouncing(handleFetchSearchFile,500);
   
  return (
    <div className='w-120 rounded-4xl flex items-center justify-center relative'>
        <Search className='absolute left-4 w-6 h-6 text-gray-400'/>
        <Input className='rounded-[3rem] bg-athens-gray shadow outline-none pl-10.5 py-5.5' placeholder='Search your files' onChange={(e)=> {debounce(e.target.value)}}/>
   
    {showSearchResults && searchResults && searchResults.length > 0 && (
        <ul className='w-full flex flex-col gap-4 absolute top-14 bg-white shadow p-4 rounded-2xl max-h-100 overflow-y-scroll'>
            {searchResults.map((item:Models.DefaultRow) => {
                return <li key={item.$id} className='flex items-center gap-2 cursor-pointer' onClick={()=> handleSearchItemClick(item)}>
                    <Preview type={item.type} extension={item.extension} url={item.url} imgClassNames='w-10 h-10' classNames='w-14 h-14'/>
                    <div className='flex flex-col'>
                        <span className='font-medium'>{item.name}</span>
                        <span className='text-gray-500 text-sm'>{getFileSize(item.size)} {" "}{formatDateTime(item.$createdAt)}</span>
                    </div>
                </li>
            })}
        </ul>
    )}
    </div>
  )
}

export default FileSearch
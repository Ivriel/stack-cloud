import Link from 'next/link';
import { Models } from 'node-appwrite'
import React from 'react'
import Preview from './Preview';
import { formatDateTime, getFileSize } from '@/lib/utils';
import ActionDropdown from './ActionDropdown';

const Card = ({file,fullName}:{file:Models.DefaultRow;fullName:string;}) => {
  return (
    <Link href={file.url} target='_blank' className='bg-white flex gap-1 flex-col p-4 rounded-2xl shadow-xl h-55 w-66'>
        <div className='flex justify-between items-start'>
            <Preview type={file.type} extension={file.extension} url={file.url}/>

            <div className='flex flex-col items-end justify-between h-full'>
                <ActionDropdown file={file}/>
                <span className='text-gray-500 font-medium text-sm'>
                    {getFileSize(file.size)}
                </span>
            </div>
        </div>

        <div className='flex justify-between items-center'>
            <div className='font-medium truncate mt-2'>{file.name}</div>
        </div>

        <span className='text-gray-700 font-medium'>
            {formatDateTime(file.$createdAt)}
        </span>
        <span className='text-gray-600'>By: {fullName}</span>
    </Link>
  )
}

export default Card
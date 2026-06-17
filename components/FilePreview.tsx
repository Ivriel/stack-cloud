import { Models } from 'node-appwrite'
import React from 'react'
import Preview from './Preview'
import { formatDateTime, getFileSize } from '@/lib/utils'

const FilePreview = ({file}:{file:Models.DefaultRow}) => {
  return (
    <div className='border border-gray-200 rounded-xl p-3 flex gap-3 items-center min-w-0'>
        <Preview type={file.type} extension={file.extension} url={file.url} imgClassNames='w-10 h-10' classNames='w-14 h-14 shrink-0'/>

        <div className='flex flex-col gap-0.5 min-w-0 overflow-hidden'>
           <span className='text-gray-700 font-medium truncate'>{file.name}</span>
           <span className='text-gray-500 text-sm'>
            {getFileSize(file.size)} · {formatDateTime(file.$createdAt)}
           </span>
        </div>
    </div>
  )
}

export default FilePreview
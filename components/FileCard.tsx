import { FileCardProps } from '@/lib/types'
import { getFileSizeByType } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

const FileCard = ({id,bgColor,imgSrc,title,allFiles}:FileCardProps) => {
    const size = getFileSizeByType(allFiles,id)?.size;
    const createdAt = getFileSizeByType(allFiles,id).created;
  return (
    <div className='bg-white w-full rounded-2xl flex flex-col p-5 gap-4'>
        <div className='flex items-center justify-between'>
            <div className={`${bgColor} w-max rounded-full p-3 shadow-2xl`}>
                <Image width={25} height={25} src={imgSrc} alt='icon' className='invert'/>
            </div>
            <h2 className='text-sm font-medium'>{size}</h2>
        </div>
        <p className='text-lg font-semibold text-black'>{title} </p>
        <p className="text-sm text-gray-800 flex flex-col">Last uploaded:  <span className='text-sm text-gray-400'>{createdAt}</span></p>
    </div>
  )
}

export default FileCard
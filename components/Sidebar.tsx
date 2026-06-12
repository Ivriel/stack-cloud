"use client"
import { SIDEBAR_ITEMS, USER_ICON } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import Progress from './Progress';
import Image from 'next/image';

const Sidebar = ({fullName,fileSize}:{fullName:string;fileSize:string;}) => {
    const pathname = usePathname() 
  return (
   <aside className='w-66 p-4 pt-8 bg-white flex flex-col h-screen'>
    {/* Logo */}
    <div className='flex items-center justify-start gap-3'>
        <Layers className='w-10 h-10 text-froly'/>
        <span className='font-medium text-xl'>StackCloud</span>
    </div>

    {/* Nav items — flex-1 biar ambil sisa space */}
    <div className='flex flex-col mt-8 gap-4 flex-1'>
        {SIDEBAR_ITEMS.map((sidebar) => {
            const {name, icon:Icon, url} = sidebar || {};
            const isActive = pathname === url;
            return (
                <Link
                    key={url}
                    href={url}
                    className={cn(
                        'flex items-center justify-start gap-3 cursor-pointer py-2 px-3 rounded-md',
                        isActive ? 'bg-froly' : ''
                    )}
                >
                    <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-700')}/>
                    <span className={cn('font-medium', isActive ? 'text-white' : 'text-gray-700')}>{name}</span>
                </Link>
            )
        })}
    </div>

    {/* Storage card — selalu di bawah */}
    <div className='bg-froly flex flex-col items-start px-4 pt-2 pb-4 rounded-md'>
        <span className='text-white font-medium'>Storage</span>
        <span className='text-white text-sm'>{fileSize} of 6GB</span>
        <Progress percentage={150}/>
    </div>

    <div className='flex items-center gap-3 mt-4'>
        <Image src={USER_ICON} alt='user-icon' width={40} height={40} className='rounded-full'/>
        <span className='font-medium text-gray-700'>{fullName}</span>
    </div>
</aside>
  )
}

export default Sidebar
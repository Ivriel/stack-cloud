"use client"
import { signOutUser } from '@/lib/appwrite/user.actions'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import FileUploader from './FileUploader'
import FileSearch from './FileSearch'

const Header = ({ownerId,accountId}:{ownerId:string;accountId:string}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push("/auth")
    } catch (error) {
      console.error("Logout failed:",error)
    }
    

  }
  return (
    <div className='flex items-center justify-between px-7 mt-6'>
        <FileSearch />
        <div className='flex gap-4'>
            <FileUploader ownerId={ownerId} accountId={accountId}/>
            <button 
            onClick={handleLogout}
            className='cursor-pointer h-11 w-11 flex items-center justify-center gap-2 bg-froly/10 rounded-full'>
              <LogOut className='text-froly h-5 w-5 rotate-180'/>
            </button>
        </div>
    </div>
  )
}

export default Header
"use client"
import { signOutUser } from '@/lib/appwrite/user.actions'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FileUploader from './FileUploader'
import FileSearch from './FileSearch'
import { SidebarTrigger } from './ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog'

const Header = ({ ownerId, accountId }: { ownerId: string; accountId: string }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOutUser()
      router.push('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-3 px-4 mt-4'>
      <SidebarTrigger className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" />

      <div className='flex-1'>
        <FileSearch />
      </div>

      <div className='flex gap-3'>
        <FileUploader ownerId={ownerId} accountId={accountId} />

        {/* Logout trigger button */}
        <button
          onClick={() => setOpen(true)}
          className='cursor-pointer h-10 w-10 flex items-center justify-center bg-froly/10 rounded-full hover:bg-froly/20 transition-colors'
        >
          <LogOut className='text-froly h-4 w-4 rotate-180' />
        </button>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl sm:max-w-sm">
          <DialogHeader className="items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-froly/10 flex items-center justify-center mx-auto">
              <LogOut className="text-froly w-5 h-5 rotate-180" />
            </div>
            <DialogTitle className="text-gray-800">Sign out?</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row gap-3 mt-2">
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 h-11 rounded-full bg-froly hover:bg-froly/90 text-white text-sm font-medium cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing out…
                </>
              ) : (
                'Sign out'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header

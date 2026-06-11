import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog';
import { Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import ButtonWithLoading from './ButtonWithLoading';
import { verifySecret } from '@/lib/appwrite/user.actions';
import { useRouter } from 'next/navigation';

const OTPModal = ({accountId, email}: {accountId: string; email: string}) => {
  const [showOtpModal,setShowOtpModal] = useState(true);
  const [loading,setLoading] = useState(false);
  const [password,setPassword] = useState("");
  const router = useRouter();
  const otpRef = useRef<HTMLInputElement>(null);

  const handleVerifyEmail = async() => {
    setLoading(true);

    try {
        const session = await verifySecret({accountId,password})
        if(session) {
            router.push("/");
        }
    } catch (error) {
        console.error("Failed to verify OTP",error)
    } finally{
        setLoading(false)
    }
  }
  return (
    <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
      <DialogContent className='max-w-md w-full'>
        <div className='flex flex-col items-center justify-center px-4 py-2'>
          
          {/* Icon */}
          <div className='bg-froly/10 rounded-full w-16 h-16 flex items-center justify-center'>
            <Mail className='w-8 h-8 text-froly'/>
          </div>

          {/* Title */}
          <span className='text-2xl font-medium mt-6'>Check your email</span>
          
          {/* Subtitle */}
          <span className='text-center text-gray-600 font-light mt-2'>
            Enter the verification code sent to{" "}
            <strong className='font-medium text-black'>{email}</strong>
          </span>

          {/* OTP Input */}
          <div onClick={() => otpRef.current?.focus()}>
          <InputOTP ref={otpRef} autoFocus maxLength={6} className='mt-8' value={password} onChange={setPassword}>
            <InputOTPGroup className='flex gap-2'>
              {[0,1,2,3,4,5].map(i => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className='border border-gray-300 rounded-md w-11 h-11 text-lg'
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          </div>

        <span className='mt-4 text-gray-600'>Didn&apos;t get a code? {" "}
            <strong className='text-black underline cursor-pointer'>resend</strong>
        </span>
        <ButtonWithLoading loading={loading} onClick={handleVerifyEmail}/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OTPModal
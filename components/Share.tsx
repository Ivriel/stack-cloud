import { Models } from 'node-appwrite'
import React, { useState } from 'react'
import FilePreview from './FilePreview';
import CustomInput from './CustomInput';
import { Mail } from 'lucide-react';

const Share = ({file,onEmailChange}:{file:Models.DefaultRow;onEmailChange:React.Dispatch<React.SetStateAction<string[]>>}) => {
  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmailInput(val);
    onEmailChange(val.trim().split(",").map(s => s.trim()).filter(Boolean));
  };

  return (
    <div>
        <FilePreview file={file}/>
        <div className='flex items-center justify-center mt-4'>
            <span>Share file with others user</span>
        </div>
        <CustomInput
          Icon={Mail}
          labelTitle='Email'
          labelHtmlFor='email'
          value={emailInput}
          onChange={handleChange}
          inputName='shareEmail'
          classNames='mt-3'
        />

        <div className='mt-4'>
            {file?.users?.map((email:string)=> {
                return <span key={email} className='text-gray-600 font-medium'>{email}</span>
            })}
        </div>
    </div>
  )
}

export default Share

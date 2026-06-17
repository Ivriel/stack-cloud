import { Models } from 'node-appwrite'
import { useState } from 'react'
import FilePreview from './FilePreview';
import CustomInput from './CustomInput';
import { Mail, Users } from 'lucide-react';

const Share = ({
  file,
  onEmailChange,
}: {
  file: Models.DefaultRow;
  onEmailChange: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [emailInput, setEmailInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmailInput(val);
    onEmailChange(
      val.trim().split(",").map((s) => s.trim()).filter(Boolean)
    );
  };

  const sharedWith: string[] = Array.isArray(file.users)
    ? file.users.filter(Boolean)
    : [];
  const shareCount = sharedWith.length;

  return (
    <div className="flex flex-col gap-4">
      <FilePreview file={file} />

      <p className="text-center text-sm text-gray-500">Share file with others</p>

      <CustomInput
        Icon={Mail}
        labelTitle="Email"
        labelHtmlFor="email"
        value={emailInput}
        onChange={handleChange}
        inputName="shareEmail"
      />

      {/* Shared with section */}
      {shareCount > 0 && (
        <div className="mt-1">
          {/* Header row with count badge — like YouTube share count */}
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">Shared with</span>
            <span className="ml-auto inline-flex items-center rounded-full bg-froly/10 px-2 py-0.5 text-xs font-semibold text-froly">
              {shareCount} {shareCount === 1 ? "person" : "people"}
            </span>
          </div>

          {/* Email pills */}
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
            {sharedWith.map((email) => (
              <div
                key={email}
                className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2"
              >
                {/* Avatar initial */}
                <div className="w-7 h-7 rounded-full bg-froly/20 flex items-center justify-center text-xs font-semibold text-froly uppercase shrink-0">
                  {email[0]}
                </div>
                <span className="text-sm text-gray-700 truncate">{email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;

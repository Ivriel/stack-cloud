import { FileType } from '@/lib/types';
import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image'

const Preview = ({type, extension, url, classNames, imgClassNames}: {
    type: string;
    extension: string;
    url: FileType | string;
    classNames?: string;
    imgClassNames?: string;
}) => {
  const isImage = type === "image" && extension !== "svg";
  const bgClass = isImage ? "" : "bg-froly/10";

  return (
    <figure className={cn(
      "rounded-full flex items-center justify-center overflow-hidden shrink-0",
      bgClass,
      classNames ?? "w-11 h-11"  // default size, overridden by classNames when passed
    )}>
      <Image
        src={isImage ? url as string : getFileIcon(extension)}
        height={isImage ? 44 : 28}
        width={isImage ? 44 : 28}
        alt="file-preview"
        className={cn(
          isImage ? "object-cover w-full h-full rounded-full" : "object-contain",
          imgClassNames
        )}
        unoptimized={isImage}
      />
    </figure>
  )
}

export default Preview

import { FileType } from '@/lib/types';
import { cn, getFileIcon } from '@/lib/utils';
import Image from 'next/image'

const Preview = ({type,extension,url,classNames,imgClassNames}:{
    type:string;
    extension:string;
    url: FileType |string;
    classNames?:string;
    imgClassNames?:string;
}) => {
  const isImage = type === "image" && extension !== "svg";
  const imageClassName = isImage ? "rounded-full h-20 w-20" : "object-contain";
  const bgClass = isImage ? "" : "bg-froly/10";
  return (<figure className={cn(`rounded-full h-22 w-22 flex items-center justify-center overflow-hidden`,bgClass)}>
    <Image src={isImage ? url : getFileIcon(extension)} height={55} width={55} alt='file-preview' className={cn(`overflow-hidde`,imageClassName,imgClassNames)}/>
  </figure>)
}

export default Preview
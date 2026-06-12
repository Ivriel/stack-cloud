import { ChartPie, Files, Images, LayoutDashboard, LucideIcon, PictureInPicture } from 'lucide-react';

export const SIDEBAR_ITEMS: { name: string; icon: LucideIcon; url: string }[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    url: "/"
  },
  {
    name: "Documents", 
    icon: Files,
    url: "/documents"
  },
  {
    name:"Images",
    icon:Images,
    url:"/images"
  },
  {
    name:"Media",
    icon:PictureInPicture,
    url:"/media"
  },
  {
    name:"Others",
    icon:ChartPie,
    url:"/others"
  }
]

export const MAX_FILE_SIZE:number = 50 * 1024 * 1024; // 50 MB
export const USER_ICON:string = "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
import {
  ChartPie,
  Download,
  Files,
  FolderPen,
  Images,
  Info,
  LayoutDashboard,
  PictureInPicture,
  Share,
  Trash,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    name: "Documents",
    icon: Files,
    url: "/documents",
  },
  {
    name: "Images",
    icon: Images,
    url: "/images",
  },
  {
    name: "Media",
    icon: PictureInPicture,
    url: "/media",
  },
  {
    name: "Others",
    icon: ChartPie,
    url: "/others",
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ACTION_ITEMS = [
  {
    value: "rename",
    label: "Rename",
    icon: FolderPen,
    iconColor: "text-bright-turquoise",
    iconBgColor: "bg-bright-turquoise/10",
  },
  {
    value: "details",
    label: "Details",
    icon: Info,
    iconColor: "text-froly",
    iconBgColor: "bg-froly/10",
  },
  {
    value: "share",
    label: "Share",
    icon: Share,
    iconColor: "text-flamenco",
    iconBgColor: "bg-flamenco/10",
  },
  {
    value: "download",
    label: "Download",
    icon: Download,
    iconColor: "text-cornflower-blue",
    iconBgColor: "bg-cornflower-blue/10",
  },
  {
    value: "delete",
    label: "Delete",
    icon: Trash,
    iconColor: "text-persimmon",
    iconBgColor: "bg-persimmon/10",
  },
];

export const FILTER_TYPES = [
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Date Created (Newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Date Created (Oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

export const FILE_CARDS = [
  {
    id: "document",
    title: "Documents",
    imgSrc: "https://cdn-icons-png.flaticon.com/128/10309/10309617.png",
    bgColor: "bg-flory",
  },
  {
    id: "image",
    title: "Images",
    imgSrc: "https://cdn-icons-png.flaticon.com/128/9261/9261193.png",
    bgColor: "bg-persian-pink",
  },
  {
    id: "media",
    title: "Media",
    imgSrc: "https://cdn-icons-png.flaticon.com/128/8407/8407947.png",
    bgColor: "bg-persimmon",
  },
  {
    id: "other",
    title: "Others",
    imgSrc: "https://cdn-icons-png.flaticon.com/128/3059/3059838.png",
    bgColor: "bg-jaffa",
  },
];

export const USER_ICON =
  "https://png.pngtree.com/png-vector/20250514/ourlarge/pngtree-3d-profile-icon-png-image_16279302.png";

import { IButtonLoadingProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";

const ButtonWithLoading = ({
  loading,
  onClick,
  label = "Continue",
  classNames,
}: IButtonLoadingProps) => {
  return (
    <button
      className={cn(
        `flex items-center justify-center gap-2 
        bg-froly disabled:bg-froly/80 disabled:cursor-not-allowed 
        font-medium text-white mt-6 cursor-pointer rounded-xl w-full h-14  text-lg  
        hover:bg-froly/90`,
        classNames,
      )}
      onClick={onClick}
      disabled={loading}
    >
      {label}
      {loading ? <Spinner className="w-6 h-6" /> : null}
    </button>
  );
};

export default ButtonWithLoading;

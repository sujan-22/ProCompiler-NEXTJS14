import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({ className, children }) => {
    return (
        <div
            className={cn(
                "h-full mx-auto w-full max-w-screen-xl px-1 md:px-10",
                className
            )}
        >
            {children}
        </div>
    );
};

export default MaxWidthWrapper;

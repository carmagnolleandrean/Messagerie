import * as React from "react";

export const Avatar = React.forwardRef(({ className, src, alt, ...props }, ref) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ""}`}
      ref={ref}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
          {alt ? alt.charAt(0).toUpperCase() : "U"}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

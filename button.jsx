import * as React from "react";

export const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  };
  
  const variantStyle = variants[variant || "default"];
  const sizeStyle = sizes[size || "default"];
  
  const buttonClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${className || ""}`;
  
  return (
    <button className={buttonClassName} ref={ref} {...props} />
  );
});

Button.displayName = "Button";

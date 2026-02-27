
import React from "react";
import clsx from "clsx";

type ButtonProps = {
  href?: string;
  variant?: "gold" | "outline" | "flat";
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

export default function Button({
  href,
  variant = "gold",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-full transition focus:outline-none focus:ring-2 focus:ring-np-gold";
  const sizes = {
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };
  const variants = {
    gold:
      "bg-np-gold text-black shadow-soft hover:brightness-110 hover:shadow-lg",
    outline:
      "border border-np-gold text-np-gold bg-transparent hover:bg-np-gold/10",
    flat: "bg-transparent text-np-gold hover:text-white",
  };
  if (href) {
    return (
      <a
        href={href}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

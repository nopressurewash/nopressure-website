import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  goldBorder?: boolean;
}

export default function Card({ children, className = "", goldBorder = false }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white/5 border transition-shadow shadow-soft hover:shadow-lg",
        goldBorder ? "border-np-gold" : "border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}

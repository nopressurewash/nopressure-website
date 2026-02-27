
import React, { JSX } from "react";
import clsx from "clsx";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Section({ children, className = "", as = "section" }: SectionProps) {
  const Comp = as;
  return (
    <Comp className={clsx("py-16 md:py-24", className)}>{children}</Comp>
  );
}

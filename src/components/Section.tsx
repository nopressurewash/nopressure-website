

import React, { JSX } from "react";
import clsx from "clsx";

type SectionSize = "large" | "medium" | "small";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  size?: SectionSize;
  containerClassName?: string;
}

const sizeMap: Record<SectionSize, string> = {
  large: "py-24",
  medium: "py-16",
  small: "py-12",
};

export default function Section({
  children,
  className = "",
  as = "section",
  size = "medium",
  containerClassName = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
}: SectionProps) {
  const Comp = as;
  return (
    <Comp className={clsx(sizeMap[size], className)}>
      <div className={containerClassName}>{children}</div>
    </Comp>
  );
}

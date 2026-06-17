import clsx from "clsx";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/nopressure.au/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/profile.php?id=61588346376881",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
] as const;

type SocialLinksProps = {
  className?: string;
  size?: "sm" | "md";
  onLinkClick?: () => void;
};

export default function SocialLinks({
  className,
  size = "sm",
  onLinkClick,
}: SocialLinksProps) {
  const iconBox = size === "sm" ? "h-[18px] w-[18px]" : "h-5 w-5";
  const tapTarget = size === "sm" ? "p-1.5" : "p-3";

  return (
    <div className={clsx("flex items-center gap-0.5", className)}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          onClick={onLinkClick}
          className={clsx(
            "inline-flex items-center justify-center rounded-full text-white/75 hover:text-np-gold hover:bg-white/5 transition-colors",
            tapTarget
          )}
        >
          <span className={iconBox}>{link.icon}</span>
        </a>
      ))}
    </div>
  );
}

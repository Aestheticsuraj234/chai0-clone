import { cn } from "@/lib/utils";

type Chai0LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

function Chai0Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect
        x="8.5"
        y="4"
        width="27"
        height="40"
        rx="13.5"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <path
        fill="currentColor"
        d="M10.8 38.2C10.8 32.5 13.8 26.5 19.5 24.8C16.2 29.2 13.2 34.2 10.8 38.2Z"
      />
    </svg>
  );
}

export function Chai0Logo({
  className,
  showWordmark = true,
}: Chai0LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <Chai0Mark className="h-7 w-auto" />
      {showWordmark ? (
        <span className="text-base font-semibold tracking-tight">chai0</span>
      ) : null}
    </span>
  );
}

export { Chai0Mark };

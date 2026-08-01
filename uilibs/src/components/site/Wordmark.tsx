import Link from "next/link";

/**
 * ADISA wordmark with Yoruba diacritic signs above the name.
 *
 * Àdísà is the Yoruba form. The floating accent line is typeset character-for-
 * character above their ADISA counterparts:
 *
 *      `   ´   .  `
 *      A   D   S  A     <- roman under side
 *
 * The accents are a quiet nod to the family that gave the brand its name:
 * Darosa, who gave freely even when he had a lot.
 */
export function Wordmark({
  size = "sm",
  asLink = true,
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  asLink?: boolean;
}) {
  const sizeMap = {
    xs: { mark: ".5rem",   word: "0.85rem", gap: "-0.05em" },
    sm: { mark: ".65rem",  word: "1.1rem",  gap: "0"        },
    md: { mark: ".85rem",  word: "1.65rem", gap: "0"         },
    lg: { mark: "1.1rem",  word: "2.4rem",  gap: "0"         },
    xl: { mark: "1.6rem",  word: "3.4rem",  gap: "0"         },
  } as const;

  const s = sizeMap[size];

  const inner = (
    <span
      className="inline-flex flex-col items-start leading-none"
      aria-label="ADISA, pronounced Ah-dee-sah"
    >
      {/* tone marks row, monospaced so the accents land over the letters */}
      <span
        aria-hidden
        style={{
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: s.mark,
          letterSpacing: "0.3em",
          marginLeft: "0.45em",
          color: "var(--adisa-accent)",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {/* À = GRAVE, í = ACUTE, s = no diacritic, à = GRAVE */}
        &#x300; &nbsp;&#x301;&nbsp; &nbsp;&#x300;
      </span>
      <span
        className="adisa-wordmark"
        style={{ fontSize: s.word, color: "var(--foreground)", marginTop: s.gap }}
      >
        ADISA
      </span>
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" prefetch={false} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return inner;
}

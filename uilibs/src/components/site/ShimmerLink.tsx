"use client";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function ShimmerLink({
  href,
  children,
  className = "",
  shimmerColor = "#b8893c",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}) {
  return (
    <Link href={href} className={`inline-flex ${className}`}>
      <ShimmerButton
        shimmerColor={shimmerColor}
        className="font-head"
        // The button's onClick is harmless; the <a> wrapping handles real nav.
      >
        {children}
      </ShimmerButton>
    </Link>
  );
}

"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

/**
 * Wraps every route with the navbar, footer and animated cart drawer.
 *
 * Admin routes (`/admin`, `/admin/dashboard`) opt out of the storefront
 * chrome so the dashboard can render its own minimal layout.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

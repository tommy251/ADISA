import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--adisa-bone)]">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center border-2 border-black bg-white shadow-[6px_6px_0_#000]">
          <Compass className="h-9 w-9 text-[var(--adisa-clay)]" />
        </div>
        <p className="mt-6 font-head text-7xl font-extrabold leading-none">404</p>
        <h1 className="mt-4 font-head text-2xl font-extrabold">
          This path does not lead anywhere.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you wanted may have moved, sold out, or never existed in the first place.
          Let us get you back to the shoes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-semibold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
          >
            Browse shoes <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-black bg-white px-6 py-3 font-head font-semibold shadow-[5px_5px_0_#000]"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

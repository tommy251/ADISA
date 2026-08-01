"use client";

import React from "react";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";

export function AsciiGlitchRippleDemo() {
  const books = [
    { title: "Roadside Picnic — Arkady & Boris Strugatsky", dur: 1200 },
    { title: "The City & the City — China Miéville", dur: 1000 },
    { title: "Parable of the Sower — Octavia E. Butler", dur: 800 },
    { title: "The Fifth Head of Cerberus — Gene Wolfe", dur: 1000 },
    { title: "His Master's Voice — Stanisław Lem", dur: 1100 },
    { title: "The Left Hand of Darkness — Ursula K. Le Guin", dur: 900 },
  ];

  return (
    <div className="flex w-full min-h-[400px] flex-col items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h4 className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">ASCII Glitch Ripple</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Hover over the links below to trigger the ripple wave.
          </p>
        </div>

        {/* Links Menu */}
        <ul className="space-y-4">
          {books.map((book, idx) => (
            <li key={idx} className="relative group pl-6">
              {/* Custom indicator animation */}
              <span className="absolute left-0 top-[60%] w-3 h-[1px] bg-zinc-400 dark:bg-zinc-600 origin-right transition-transform duration-300 scale-x-100 group-hover:scale-x-150 group-hover:bg-zinc-900 dark:group-hover:bg-white" />
              
              <AsciiGlitchRipple
                as="a"
                href="#"
                dur={book.dur}
                spread={1.2}
                aria-label={book.title}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200"
              >
                {book.title}
              </AsciiGlitchRipple>
            </li>
          ))}
        </ul>

        {/* Footer info */}
        <div className="text-[10px] text-zinc-400 dark:text-zinc-600 flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-900">
          <span>Spread: 1.2</span>
          <span>Char Pool: Default ASCII</span>
          <span>★ Vengeance UI</span>
        </div>
      </div>
    </div>
  );
}

export default AsciiGlitchRippleDemo;

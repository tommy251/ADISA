"use client";

import Image from "next/image";
import { Text } from "@/components/retroui";
import { useTheme } from "@/contexts/ThemeContext";

export default function WorksWithSection() {
  const { isDarkMode } = useTheme();

  const frameworks = [
    {
      name: "vite",
      lightSrc: "/images/logos/vite.png",
      darkSrc: "/images/logos/vite_white.png",
      size: 60,
    },
    {
      name: "nextjs",
      lightSrc: "/images/logos/nextjs.png",
      darkSrc: "/images/logos/next_white.png",
      size: 60,
    },
    {
      name: "remix",
      lightSrc: "/images/logos/remix.png",
      darkSrc: "/images/logos/remix_white.png",
      size: 55,
    },
    {
      name: "astro",
      lightSrc: "/images/logos/astro.png",
      darkSrc: "/images/logos/astro_white.png",
      size: 55,
    },
    {
      name: "gatsby",
      lightSrc: "/images/logos/gatsby.png",
      darkSrc: "/images/logos/gatsby_white.png",
      size: 60,
    },
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 lg:px-0 my-48" id="works-with">
      <Text as="h2" className="text-center max-w-2xl mx-auto mb-28">
        Works With Both <span className="text-outlined">SSR</span> and{" "}
        <span className="text-outlined">SPA</span> Applications.
      </Text>

      <div className="grid grid-cols-5 gap-8 lg:gap-6 max-w-2xl mx-auto items-center">
        {frameworks.map((framework) => (
          <div key={framework.name}>
            <Image
              src={isDarkMode ? framework.darkSrc : framework.lightSrc}
              alt={`${framework.name} ${isDarkMode ? 'dark' : 'light'}`}
              width={framework.size}
              height={framework.size}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
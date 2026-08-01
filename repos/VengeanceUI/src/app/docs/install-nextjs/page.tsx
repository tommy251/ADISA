import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  DocsArticle,
  DocsCodeBlock,
  DocsHeader,
  DocsParagraph,
  DocsSection,
  DocsSubsection,
} from "@/components/docs/static-docs";
import { CopyButton } from "@/components/ui/copy-button";
import { COMMUNITY_TOKEN_CA, COMMUNITY_TOKEN_DEX_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Install Next.js",
  description: "Create a Next.js project configured for Vengeance UI components.",
  alternates: {
    canonical: "/docs/install-nextjs",
  },
};

export default function InstallNextjsPage() {
  return (
    <DocsArticle>
      <DocsHeader
        title="Install Next.js"
        description="Install Next.js with Create Next App"
      />

      <DocsSection title="Official CA">
        <DocsParagraph>
          The community token CA is published here for quick verification.
        </DocsParagraph>
        <div className="max-w-4xl rounded-md border bg-neutral-50 p-4 dark:bg-zinc-950">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-neutral-700 dark:text-zinc-300">
              Community Token CA
            </span>
            <CopyButton
              code={COMMUNITY_TOKEN_CA}
              className="border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            />
          </div>
          <code className="block break-all rounded-md bg-white px-3 py-2 font-mono text-sm text-neutral-950 dark:bg-zinc-900 dark:text-zinc-100">
            {COMMUNITY_TOKEN_CA}
          </code>
          <Link
            href={COMMUNITY_TOKEN_DEX_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            View on DEX Screener
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </DocsSection>

      <DocsSection title="Create a new project">
        <DocsCodeBlock code="npx create-next-app@latest my-app" />
      </DocsSection>

      <DocsSection title="On installation, you'll see the following prompts">
        <DocsCodeBlock
          code={`What is your project named? my-app
Would you like to use the recommended Next.js defaults?
  Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
  No, reuse previous settings
  No, customize settings - Choose your own preferences

If you customize settings:
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a src/ directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (@/* by default)? No / Yes`}
        />
      </DocsSection>

      <DocsSection title="Start the app">
        <DocsCodeBlock
          code={`cd my-app
npm run dev`}
        />
      </DocsSection>

      <DocsSubsection title="Recommended project shape">
        <DocsParagraph>
          Use the App Router, TypeScript, Tailwind CSS, and the default{" "}
          <span className="font-mono">@/*</span> import alias. That matches how
          Vengeance UI examples and registry components are written.
        </DocsParagraph>
      </DocsSubsection>
    </DocsArticle>
  );
}

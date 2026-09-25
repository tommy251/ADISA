import { Wordmark } from "@/components/site/Wordmark";

export default function LogoPreview() {
  return (
    <div className="flex flex-col gap-16 bg-white p-16">
      <Wordmark size="xl" asLink={false} />
      <Wordmark size="xl" asLink={false} />
    </div>
  );
}

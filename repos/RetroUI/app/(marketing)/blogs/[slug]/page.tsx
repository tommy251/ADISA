import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Avatar, Badge, Button, Text } from "@/components/retroui";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogs } from "#site/content";
import MDX from "@/components/MDX";

interface IProps {
  params: Promise<{ slug: string }>;
}

function getBlogBySlug(slug: string) {
  return blogs.find(
    (blog) => blog.slug === slug && blog.status === "published",
  );
}

export function generateStaticParams() {
  return blogs
    .filter((blog) => blog.status === "published")
    .map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const params = await props.params;
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Not Found | Retro UI",
    };
  }

  return {
    title: `${blog.title} | RetroUI Blogs`,
    description: blog.description,
    alternates: {
      canonical: `https://www.retroui.dev/blogs/${blog.slug}`,
    },
    openGraph: {
      type: "article",
      images: blog.coverImage,
      title: `${blog.title} | RetroUI Blogs`,
      publishedTime: blog.publishedAt,
      authors: [blog.author.name],
    },
  };
}

export default async function page(props: IProps) {
  const params = await props.params;
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return notFound();
  }

  return (
    <article className="max-w-3xl mt-8 mx-auto">
      <div className="border-b border-black pb-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Text className="text-muted-foreground text-sm font-medium">
            {format(new Date(blog.publishedAt), "dd, MMMM yyyy")}
          </Text>
          <Text>|</Text>
          <div className="flex items-center gap-3">
            {blog.tags.map((tag, index) => (
              <Badge
                key={tag}
                size="sm"
                variant="surface"
                className={`bg-${["red", "green", "blue", "yellow", "purple", "pink"][
                  index % 6
                ]
                  }-300`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Text as="h1" className="mb-2">
          {blog.title}
        </Text>
        <Text className="text-muted-foreground mb-12">
          {blog.description}
        </Text>
        <Image
          src={blog.coverImage}
          alt={blog.title}
          width={1200}
          height={800}
          className="mb-8"
        />
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <Avatar>
              <Avatar.Image src={blog.author.avatar} alt={blog.author.name} />
              <Avatar.Fallback>
                {blog.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <Text as="h5">{blog.author.name}</Text>
              {blog.author.x && (
                <Link
                  href={`https://x.com/${blog.author.x}`}
                  target="_blank"
                  className="text-muted-foreground"
                >
                  @{blog.author.x}
                </Link>
              )}
            </div>
          </div>

          <Link
            target="_blank"
            href={`https://x.com/share?url=${`https://www.retroui.dev/blogs/${blog.slug}`}&text=${blog.title}.%0ACheck it out 👉`}
          >
            <Button size="sm" variant="outline">
              Share on X
            </Button>
          </Link>
        </div>
      </div>

      <MDX code={blog.code} type="blog" />

      <hr className="my-12" />

      <Button render={<Link href="/blogs" className="inline-flex">← Back to blogs</Link>} aria-label="Return to all blog posts" variant="secondary" />
    </article>
  );
}

import { Card, Text } from "@/components/retroui";
import { blogs } from "#site/content";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

function page() {
  const posts = blogs
    .filter((blog) => blog.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return (
    <div>
      <Text as="h1" className="mb-12">
        All RetroUI Blogs
      </Text>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {posts.map((blog) => (
          <Link href={blog.url} key={blog.slug}>
            <Card className="shadow-none hover:-translate-x-2 hover:-translate-y-2 hover:shadow-lg">
              <Card.Header>
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  width={600}
                  height={400}
                  className="mb-6 h-50"
                />
                <Text as="p" className="mb-2 text-sm text-muted-foreground">
                  {format(new Date(blog.publishedAt), "dd, MMMM yyyy")}
                </Text>
                <Card.Title className="line-clamp-2 text-2xl">{blog.title}</Card.Title>

                <Card.Description className="line-clamp-2 text-sm">{blog.description}</Card.Description>
              </Card.Header>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default page;

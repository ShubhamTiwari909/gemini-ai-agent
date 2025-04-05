import { fetchPosts } from "@/components/Post/Post";
import { fetchUserId, formatDate } from "@/lib/utils";
import { Posts } from "@/types/response-handlers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const fetchUser = async (
  expressUrl: string,
  email: string,
  userId: string | null | undefined,
) => {
  try {
    const response = await fetch(`${expressUrl}/users/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ email, userId }),
    });

    const data = await response.json();

    if (data.error) {
      notFound();
    }

    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    notFound();
  }
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const expressUrl = process.env.EXPRESS_API_URL || "";
  const email = id.replace("%40", "@");
  const userId = await fetchUserId(email || "");

  const [data, post] = await Promise.all([
    fetchUser(expressUrl, email, userId),
    fetchPosts(expressUrl, email, userId, 10),
  ]);

  if (data.message || post.message) {
    return (
      <div className="w-full h-screen grid place-items-center text-4xl">
        {data.message || post.message}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 items-start gap-10 min-h-[calc(100vh-64px)] px-5 relative pt-10">
      {/* Added a timestamp to force next js to revalidate the image */}
      <Image
        src={`https://picsum.photos/1920/1080/?t=${Date.now()}`}
        alt="Random background"
        fill
        className="-z-10 opacity-70"
      />
      <div className="p-5 flex flex-col items-center text-center lg:sticky lg:top-31 h-fit mb-10 lg:mb-0 lg:col-span-3 bg-base-content text-base-100 rounded-3xl">
        <Image
          src={data.image.replace("s96", "s400")}
          alt={data.name}
          width={200}
          height={200}
          className="rounded-full mb-5 border-4 border-base-100"
        />
        <h2 className="mb-2 text-2xl">{data.name}</h2>
        <p className="break-words lg:max-xl:max-w-40 lg:max-w-full">
          {data.email}
        </p>
      </div>
      <div className="w-full px-5 lg:col-span-9">
        <h2 className="text-2xl font-semibold mb-4 p-3 rounded-2xl bg-base-content text-base-100 w-fit">
          Latest Searches by the User
        </h2>
        <hr className="mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-8">
          {post.length === 0 ? (
            <p>No searches found for the user</p>
          ) : (
            post.map((item: Posts) => (
              <div
                key={item._id}
                className="mb-5 lg:w-80 bg-base-100 rounded-2xl p-3 border border-base-content"
              >
                <Link
                  href={`/post/${item._id}`}
                  className="mb-2 w-full lg:max-w-80 lg:min-h-20 line-clamp-1 text-ellipsis inline-block"
                >
                  <span className="inline-block mb-4 font-semibold w-fit">
                    {item.prompt}
                  </span>
                  <span className="inline-block text-sm w-fit">
                    {formatDate(item.createdAt as string)}
                  </span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default page;

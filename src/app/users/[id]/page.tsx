import { fetchHistory } from "@/components/History/History";
import { History } from "@/types/response-handlers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const fetchUser = async (expressUrl: string, email: string) => {
  const response = await fetch(`${expressUrl}/users/find`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const data = await fetchUser(
    process.env.EXPRESS_API_URL || "",
    id.replace("%40", "@"),
  );
  const history = await fetchHistory(
    process.env.EXPRESS_API_URL || "",
    id.replace("%40", "@"),
    5,
  );
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)] px-5 relative">
      <div className="p-5 flex flex-col items-center text-center lg:sticky lg:top-40 h-fit mb-10 lg:mb-0">
        <Image
          src={data.image.replace("s96", "s400")}
          alt={data.name}
          width={200}
          height={200}
          className="rounded-full mb-5"
        />
        <h2 className="mb-2 text-2xl">{data.name}</h2>
        <p>{data.email}</p>
      </div>
      <div className="w-full px-5">
        <h2 className="text-2xl mb-10">Latest Searches by the User</h2>
        {history.length === 0 ? (
          <p>No searches found for the user</p>
        ) : (
          history.map((item: History) => (
            <div key={item._id} className="mb-5">
              <Link
                href={`/history/${item?._id}`}
                className="mb-2 rounded-2xl p-3 border border-base-content w-full lg:w-96 line-clamp-1 text-ellipsis inline-block"
              >
                {item.prompt}
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default page;

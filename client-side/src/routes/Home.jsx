import React from "react";
import { Link, useLoaderData } from "react-router-dom";

const Home = () => {
    const homePageData = useLoaderData();
    const postsData = homePageData.data;

    return (
        <div className="p-4">
            <section className="flex flex-col md:flex-row gap-3 justify-between items-start">
                {/* Latest Posts */}
                <section className="flex-grow">
                    <h4 className="text-xl md:text-2xl dark:text-white font-lato font-semibold mb-6 underline underline-offset-4 text-center">
                        Latest Posts
                    </h4>

                    <div className="flex gap-10 flex-wrap justify-evenly">
                        {postsData.map((item, idx) => (
                            <article
                                key={idx}
                                className=" p-3 bg-gray-800 rounded-lg w-[300px]"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-52 mb-4"
                                />
                                <div>
                                    <Link
                                        to={`/post/${item._id}`}
                                        className="text-xl font-semibold dark:text-white hover:underline underline-offset-4 inline-block mb-1"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-sm mb-4">
                                        {new Date(
                                            item.createdAt
                                        ).toDateString()}
                                    </p>
                                    <p>
                                        {item.content.length > 100
                                            ? `${item.content.slice(0, 100)}...`
                                            : item.content}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Popular Posts */}
                <section className="md:w-96 min-w-80 flex-shrink-0">
                    <h4 className="text-xl md:text-2xl dark:text-white font-lato font-semibold mb-6 underline underline-offset-4 text-center">
                        Popular Posts
                    </h4>

                    <div className="bg-gray-800 p-4 space-y-3">
                        {postsData.slice(0, 4).map((item, idx) => (
                            <Link
                                to={`/post/${item._id}`}
                                key={idx}
                                className="flex gap-2 items-center group"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-16 h-12 rounded-sm"
                                />
                                <h4 className="dark:text-white group-hover:underline underline-offset-2">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
};

export default Home;

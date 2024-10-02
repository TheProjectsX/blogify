import { Link, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useState } from "react";

const Home = () => {
    const homePageDataPrimary = useLoaderData();
    const [homePageData, setHomePageData] = useState(homePageDataPrimary);
    const [loading, setDataLoading] = useState(false);

    const handleLoadMoreData = async () => {
        const serverResponse = await (
            await fetch(
                `${import.meta.env.VITE_SERVER_URL}/posts?limit=6&page=${
                    homePageData.pagination.nextPage
                }`
            )
        ).json();

        if (serverResponse.success) {
            setHomePageData((prev) => ({
                pagination: serverResponse.pagination,
                data: [...prev.data, ...serverResponse.data],
            }));
        } else {
            console.log("Something is Wrong!", serverResponse.message);
        }
    };

    return (
        <>
            <section className="flex flex-col md:flex-row gap-5 justify-between items-start">
                {/* Latest Posts */}
                <section className="flex-grow">
                    <h4 className="text-xl md:text-2xl dark:text-white font-lato font-semibold mb-6 underline underline-offset-4 text-center">
                        Latest Posts
                    </h4>

                    <div className="flex gap-10 flex-wrap justify-evenly mb-8">
                        {homePageData.data.map((item, idx) => (
                            <article
                                key={idx}
                                className=" p-3 bg-gray-800 rounded-lg w-[290px] sm:w-[300px]"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-52 mb-4"
                                />
                                <div>
                                    <Link
                                        to={`/post/${item._id}`}
                                        className="text-lg sm:text-xl font-semibold dark:text-white hover:underline underline-offset-4 inline-block mb-1"
                                    >
                                        {item.title}
                                    </Link>
                                    <p className="text-sm mb-4">
                                        {new Date(
                                            item.createdAt
                                        ).toDateString()}
                                    </p>
                                    <p
                                        className="ql-editor !p-0"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                item.content.length > 100
                                                    ? `${item.content.slice(
                                                          0,
                                                          100
                                                      )}...`
                                                    : item.content
                                            ),
                                        }}
                                    ></p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {homePageData.pagination.has_next_page && (
                        <div className="flex justify-center">
                            <button
                                className="btn btn-neutral"
                                onClick={handleLoadMoreData}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="loading"></div>
                                ) : (
                                    "Load More"
                                )}
                            </button>
                        </div>
                    )}
                </section>

                {/* Popular Posts */}
                <section className="md:w-96 sm:min-w-80 flex-shrink-0">
                    <h4 className="text-xl md:text-2xl dark:text-white font-lato font-semibold mb-6 underline underline-offset-4 text-center">
                        Popular Posts
                    </h4>

                    <div className="bg-gray-800 p-4 space-y-3">
                        {homePageData.data.slice(0, 4).map((item, idx) => (
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
                                <h4 className="dark:text-white group-hover:underline underline-offset-2 text-sm sm:text-base">
                                    {item.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>
            </section>
        </>
    );
};

export default Home;

import { Link, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";

const Post = () => {
    const [postData, postsData] = useLoaderData();

    return (
        <section className="flex flex-col md:flex-row gap-3 lg:gap-10 justify-between items-start">
            {/* Latest Posts */}
            <section className="flex-grow ">
                <div className="w-full flex justify-center">
                    <img
                        src={postData.imageUrl}
                        alt={postData.title}
                        className="w-full max-h-96 mb-6"
                    />
                </div>
                <h4 className="text-xl dark:text-white">{postData.title}</h4>
                <p className="italic mb-4 text-sm">
                    Posted At:{" "}
                    {new Date(
                        postData.createdAt || new Date().toJSON()
                    ).toDateString()}
                </p>
                <div className="flex items-center mb-4">
                    <img
                        src={postData.authorData.profilePicture}
                        alt={postData.authorData.username}
                        className="size-8 rounded-full"
                    />
                    <div className="divider divider-horizontal"></div>
                    <p>{postData.authorData.username}</p>
                </div>

                <article
                    className="mb-6 ql-editor !p-0 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            postData.content.replaceAll("<p></p>", "<br/>")
                        ),
                    }}
                ></article>

                <p className="flex gap-3 items-center">
                    <span className="italic">Tags:</span>{" "}
                    <span className="flex gap-2 items-center">
                        {postData.tags.map((item, idx) => (
                            <span key={idx} className="badge">
                                {item}
                            </span>
                        ))}
                    </span>
                </p>
            </section>

            {/* Popular Posts */}
            <section className="md:w-96 sm:min-w-80 flex-shrink-0">
                <h4 className="text-xl md:text-2xl dark:text-white font-lato font-semibold mb-6 underline underline-offset-4 text-center">
                    Popular Posts
                </h4>

                <div className="bg-gray-800 p-4 space-y-3">
                    {postsData.data.slice(0, 4).map((item, idx) => (
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
    );
};

export default Post;

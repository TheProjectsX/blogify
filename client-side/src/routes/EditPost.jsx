import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";

const EditPost = () => {
    const postDataPrimary = useLoaderData();
    const [postData, setPostData] = useState(postDataPrimary);
    const [tags, setTags] = useState(postData?.tags ?? []);
    const navigate = useNavigate();

    const handleCreateNewPost = async (e) => {
        e.preventDefault();
        const form = e.target;

        const body = {
            title: form.title.value,
            imageUrl: form.imageUrl.value,
            content: form.content.value,
            tags: tags,
        };

        let serverResponse;
        try {
            // If there is post data from before, it's editing!
            if (postData) {
                serverResponse = await (
                    await fetch(
                        `${import.meta.env.VITE_SERVER_URL}/posts/${
                            postData._id
                        }`,
                        {
                            method: "PUT",
                            headers: {
                                "content-type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify(body),
                        }
                    )
                ).json();
            } else {
                serverResponse = await (
                    await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify(body),
                    })
                ).json();

                setPostData(body);
            }

            if (serverResponse.success) {
                toast.success(
                    postData
                        ? "Post Updated Successfully!"
                        : "Posted Successfully!"
                );
            } else {
                toast.error(serverResponse.message);
            }
        } catch (error) {
            toast.error("Failed to Post!");
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <h4 className="text-2xl font-semibold font-lato dark:text-white underline underline-offset-4 mb-5 text-center">
                {postData ? "Edit Post" : "Create new Post"}
            </h4>

            {/* New Post */}
            <form onSubmit={handleCreateNewPost} className="md:w-3/4 mx-auto">
                <div className="mb-5">
                    <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Post Title <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="This is a title"
                        defaultValue={postData?.title ?? ""}
                        required
                    />
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="imageUrl"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Post Thumbnail
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="https://i.ibb.co.com/xxxxx"
                        defaultValue={postData?.imageUrl ?? ""}
                    />
                </div>
                <div className="mb-5 [&_.rti--container]:dark:bg-gray-700 [&_.rti--input]:dark:bg-gray-700 [&_.rti--tag]:dark:text-black ">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Tags
                    </label>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Enter Tag"
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="content"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Blog Content <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        className="block p-2.5 w-full h-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your Post here..."
                        defaultValue={postData?.content ?? ""}
                        required
                    ></textarea>
                </div>

                <button className="btn btn-info w-full" type="submit">
                    {postData ? "Update Post!" : "Publish Post"}
                </button>
            </form>
        </div>
    );
};

export default EditPost;

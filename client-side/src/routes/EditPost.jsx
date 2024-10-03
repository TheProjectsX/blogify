import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";

const EditPost = () => {
    let quill;
    const postDataPrimary = useLoaderData();
    const [postData, setPostData] = useState(postDataPrimary);
    const [tags, setTags] = useState(postData?.tags ?? []);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        quill = new Quill("#quill-editor", {
            theme: "snow",
        });
        if (quill && postData) {
            quill.clipboard.dangerouslyPasteHTML(postData.content);
        }
    }, []);

    const handleCreateNewPost = async (e) => {
        e.preventDefault();
        const form = e.target;

        const body = {
            title: form.title.value,
            imageUrl: form.imageUrl.value,
            content: quill.getSemanticHTML(),
            tags: tags,
        };

        let serverResponse;
        setLoading(true);
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
            }

            if (serverResponse.success) {
                toast.success(
                    postData
                        ? "Post Updated Successfully!"
                        : "Posted Successfully!"
                );
                if (postData) {
                    setPostData(body);
                } else {
                    form.reset();
                    setTags([]);
                    quill.clipboard.dangerouslyPasteHTML("");
                }
                navigate(`/post/${serverResponse.insertedId}`);
            } else {
                toast.error(serverResponse.message);
            }
        } catch (error) {
            toast.error("Failed to Post!");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <>
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
                <div className="mb-5 [&_.rti--container]:dark:bg-gray-700 [&_.rti--input]:dark:bg-gray-700 [&_.rti--tag]:dark:text-black [&_.rti--tag]:text-xs [&_.rti--tag]:sm:text-base">
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
                    <div className="bg-white">
                        <div
                            id="quill-editor"
                            className="!h-96 w-full dark:bg-gray-700 dark:text-white"
                        ></div>
                    </div>
                    {/* <div id="quill-editor">
                        <p>Hello World!</p>
  <p>Some initial <strong>bold</strong> text</p>
  <p><br /></p>
                    </div> */}
                    {/* <div className="bg-white">
                        <div
                            ref={quillRef}
                            className="!h-96 w-full dark:bg-gray-700 dark:text-white"
                        />
                    </div> */}
                </div>

                <button
                    className="btn btn-info w-full"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="loading"></div>
                    ) : postData ? (
                        "Update Post!"
                    ) : (
                        "Publish Post"
                    )}
                </button>
            </form>
        </>
    );
};

export default EditPost;

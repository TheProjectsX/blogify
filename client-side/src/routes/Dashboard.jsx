import { useContext, useState } from "react";
import UserDataContext from "../context/context";
import { Link, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const Dashboard = () => {
    const context = useContext(UserDataContext);
    const { userAuthData } = context;
    const userPostsPrimary = useLoaderData();
    const [userPosts, setUserPosts] = useState(userPostsPrimary.data);
    // const userPosts = {
    //     success: true,
    //     data: [
    //         {
    //             _id: "66fc0f4c582f0f0cb144535a",
    //             title: "This is a Title",
    //             content:
    //                 "This is the content of the post which you will love very much!",
    //             tags: [],
    //             imageUrl: "https://i.ibb.co.com/ryNv8bc/image-placeholder.jpg",
    //             authorEmail: "rahatkhanfiction@gmail.com",
    //         },
    //         {
    //             _id: "66fc0f4d582f0f0cb144535b",
    //             title: "This is a Title",
    //             content:
    //                 "This is the content of the post which you will love very much!",
    //             tags: [],
    //             imageUrl: "https://i.ibb.co.com/ryNv8bc/image-placeholder.jpg",
    //             authorEmail: "rahatkhanfiction@gmail.com",
    //         },
    //         {
    //             _id: "66fc0f4d582f0f0cb144535c",
    //             title: "This is a Title",
    //             content:
    //                 "This is the content of the post which you will love very much!",
    //             tags: [],
    //             imageUrl: "https://i.ibb.co.com/ryNv8bc/image-placeholder.jpg",
    //             authorEmail: "rahatkhanfiction@gmail.com",
    //         },
    //         {
    //             _id: "66fc1be996a4e6d99debf8ee",
    //             title: "This is a Title",
    //             content:
    //                 "This is the content of the post which you will love very much!",
    //             tags: [],
    //             imageUrl: "https://i.ibb.co.com/ryNv8bc/image-placeholder.jpg",
    //             authorEmail: "rahatkhanfiction@gmail.com",
    //         },
    //     ],
    // };

    const handleDeletePost = (id) => {
        Swal.fire({
            title: "Are you Sure you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/posts/${id}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );
                const serverResponse = await res.json();
                if (serverResponse.success) {
                    setUserPosts(userPosts.filter((item) => item._id !== id));
                    toast.success("Post Deleted Successfully!");
                } else {
                    toast.error(serverResponse.message);
                }
            }
        });
    };

    return (
        <div className="p-4">
            <section className="flex gap-8 justify-evenly items-center">
                <div className="flex gap-8 justify-center items-center">
                    {" "}
                    <div className="">
                        <img
                            src={userAuthData.profilePicture}
                            alt={userAuthData.username}
                            className="size-36 rounded-full"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold font-lato dark:text-white">
                            {userAuthData.username}{" "}
                            <span className="text-base">
                                ({userAuthData.role})
                            </span>
                        </h3>
                        <p className="mb-5">{userAuthData.email}</p>

                        <p>
                            Created At:{" "}
                            {new Date(userAuthData.createdAt).toDateString()}
                        </p>
                    </div>
                </div>
                <div className="divider divider-horizontal"></div>
                <div>
                    <p className="text-xl font-semibold dark:text-white">
                        <span className="">Posts count:</span>{" "}
                        <span>{userPosts.length}</span>
                    </p>
                </div>
            </section>

            <div className="divider"></div>

            <section>
                <div className="flex justify-between gap-3 mb-3">
                    <h4 className="text-2xl font-semibold underline underline-offset-4 dark:text-white">
                        Your Posts:
                    </h4>
                    <button className="btn">Create Post</button>
                </div>

                <div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 *:text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Post Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>

                                    <th scope="col" className="px-6 py-3"></th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userPosts.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 *:text-center"
                                    >
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-wrap dark:text-white"
                                        >
                                            {item.title}
                                        </th>
                                        <td className="px-6 py-4 min-w-40">
                                            {new Date(
                                                item.createdAt ||
                                                    new Date().toJSON()
                                            ).toDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to="#"
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline underline-offset-4"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() =>
                                                    handleDeletePost(item._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

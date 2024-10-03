import { useContext, useState } from "react";
import UserDataContext from "../context/context";
import { Link, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Dashboard = () => {
    const context = useContext(UserDataContext);
    const { userAuthData } = context;
    const userPostsPrimary = useLoaderData();
    const [userPosts, setUserPosts] = useState(userPostsPrimary.data);

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
        <>
            <section className="flex gap-8 justify-evenly items-center flex-col md:flex-row">
                <div className="flex gap-8 justify-center items-center flex-col sm:flex-row">
                    {" "}
                    <div className="">
                        <img
                            src={userAuthData.profilePicture}
                            alt={userAuthData.username}
                            className="size-36 rounded-full"
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold font-lato dark:text-white">
                            {userAuthData.username}{" "}
                            <span className="text-base">
                                ({userAuthData.role})
                            </span>
                        </h3>
                        <p className="mb-5">{userAuthData.email}</p>

                        <p className="text-sm sm:text-base">
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
                <div className="flex justify-between gap-3 mb-6">
                    <h4 className="text-2xl font-semibold underline underline-offset-4 dark:text-white">
                        Your Posts:
                    </h4>
                    <Link to={"/me/new"} className="btn btn-info btn-sm">
                        Create Post
                    </Link>
                </div>

                <div>
                    {userPosts.length === 0 ? (
                        <div className="py-5 flex flex-col items-center gap-5 text-center text-2xl font-semibold">
                            <span>No Posts to Show. Add one Now!</span>
                            <Link to="/me/new" className="btn btn-info">
                                Add new Post
                            </Link>
                        </div>
                    ) : (
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Post Title
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Created At
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-6 py-3"
                                        ></th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3"
                                        ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userPosts.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                        >
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-wrap dark:text-white"
                                            >
                                                <Link
                                                    to={`/post/${item._id}`}
                                                    className="hover:underline underline-offset-4"
                                                >
                                                    {item.title.length > 34
                                                        ? `${item.title.slice(
                                                              0,
                                                              34
                                                          )}...`
                                                        : item.title}
                                                </Link>
                                            </th>
                                            <td className="px-6 py-4 min-w-40">
                                                {new Date(
                                                    item.createdAt ||
                                                        new Date().toJSON()
                                                ).toDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/me/edit/${item._id}`}
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline underline-offset-4"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    className="btn btn-error btn-sm"
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            item._id
                                                        )
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
                    )}
                </div>
            </section>
        </>
    );
};

export default Dashboard;

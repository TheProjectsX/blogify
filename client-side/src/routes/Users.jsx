import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import UserDataContext from "../context/context";

const Users = () => {
    const context = useContext(UserDataContext);
    const { userAuthData } = context;

    const usersDataPrimary = useLoaderData();
    const [usersData, setUsersData] = useState(usersDataPrimary.data);

    const handleChangeStatus = (id, status) => {
        Swal.fire({
            title: "Are you Sure you want to Change status?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(
                    `${
                        import.meta.env.VITE_SERVER_URL
                    }/admin/users/${id}/${status}`,
                    {
                        method: "PUT",
                        credentials: "include",
                    }
                );
                const serverResponse = await res.json();
                if (serverResponse.success) {
                    setUsersData(
                        usersData.map((item) =>
                            item._id === id ? { ...item, status: status } : item
                        )
                    );
                    toast.success("Status changed Successfully!");
                } else {
                    toast.error(serverResponse.message);
                }
            }
        });
    };

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: "Are you Sure you want to Delete?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/admin/users/${id}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );
                const serverResponse = await res.json();
                if (serverResponse.success) {
                    setUsersData(usersData.filter((item) => item._id !== id));
                    toast.success("User Deleted Successfully!");
                } else {
                    toast.error(serverResponse.message);
                }
            }
        });
    };

    return (
        <div className="p-4 min-h-[700px]">
            <h4 className="text-2xl font-semibold font-lato dark:text-white underline underline-offset-4 mb-5 text-center">
                Registered Users:
            </h4>

            <div>
                {usersData.length === 0 ? (
                    <div className="py-5 flex flex-col items-center gap-5 text-center text-2xl font-semibold">
                        <span>No Users to Show</span>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 *:text-center">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>

                                    <th scope="col" className="px-6 py-3"></th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersData.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 *:text-center"
                                    >
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {item.username}
                                        </th>
                                        <td className="px-6 py-4 min-w-40">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4 min-w-40">
                                            {item.role.charAt(0).toUpperCase() +
                                                item.role.slice(1)}
                                        </td>
                                        <td className="px-6 py-4 min-w-40">
                                            {new Date(
                                                item.createdAt ||
                                                    new Date().toJSON()
                                            ).toDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className={`btn btn-sm ${
                                                    item.status === "active"
                                                        ? "btn-error"
                                                        : "btn-info"
                                                }`}
                                                onClick={() =>
                                                    handleChangeStatus(
                                                        item._id,
                                                        item.status === "active"
                                                            ? "inactive"
                                                            : "active"
                                                    )
                                                }
                                            >
                                                {item.status === "active"
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="btn btn-error btn-sm"
                                                onClick={() =>
                                                    handleDeleteUser(item._id)
                                                }
                                                disabled={
                                                    userAuthData.email ===
                                                    item.email
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
        </div>
    );
};

export default Users;

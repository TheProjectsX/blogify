import { Link, NavLink } from "react-router-dom";
import UserDataContext from "../context/context";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const NavbarComponent = () => {
    const context = useContext(UserDataContext);
    const { userAuthData, setUserAuthData, dataLoading } = context;
    const [navOpened, setNavOpened] = useState(false);

    const handleLogout = async () => {
        try {
            const serverResponse = await (
                await fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
                    credentials: "include",
                })
            ).json();

            if (serverResponse.success) {
                toast.success("Logout Successful!");
                setUserAuthData(null);
            } else {
                toast.error(serverResponse.message);
            }
        } catch (error) {
            toast.error("Failed to create user!");
            console.error(error);
        }
    };

    return (
        <nav className="max-width !p-0 sm:!px-5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 mb-4">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link
                    to="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse hover:underline underline-offset-4"
                >
                    <img src="/logo.svg" className="h-8" alt="Blogify Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Blogify
                    </span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {dataLoading ? (
                        <div className="loading"></div>
                    ) : userAuthData ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    <img
                                        alt={userAuthData.username}
                                        src={userAuthData.profilePicture}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-44 py-2 px-4 shadow"
                            >
                                <li>
                                    <Link
                                        to={"/me"}
                                        className="justify-between"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/me/new"}
                                        className="justify-between"
                                    >
                                        New Post
                                    </Link>
                                </li>
                                {userAuthData.role === "admin" && (
                                    <li>
                                        <Link
                                            to={"/admin/users"}
                                            className="justify-between"
                                        >
                                            Users (admin)
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to={"/login"}>
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Login
                            </button>
                        </Link>
                    )}
                    <button
                        data-collapse-toggle="navbar-sticky"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded="false"
                        onClick={() => setNavOpened(!navOpened)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                        navOpened ? "md:flex" : "hidden"
                    }`}
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 [&_.active]:text-blue-700 [&_.active]:dark:text-blue-500">
                        <li>
                            <NavLink
                                to="/"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                About
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarComponent;

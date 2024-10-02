import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserDataContext from "../context/context";

// Icons
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

// React Toast
import { toast } from "react-toastify";

// React Helmet
import { Helmet } from "react-helmet";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const context = useContext(UserDataContext);
    const { setUserAuthData, setDataLoading } = context;

    const handleSignUp = async (e) => {
        e.preventDefault();

        const password = e.target.password.value;
        if (!/[A-Z]/.test(password)) {
            e.target.password.style.borderColor = "red";
            toast.error(
                "Password must Contain at least one UpperCase Character",
                {
                    autoClose: 5000,
                }
            );
            return;
        } else if (!/[a-z]/.test(password)) {
            e.target.password.style.borderColor = "red";
            toast.error(
                "Password must Contain at least one LowerCase Character",
                {
                    autoClose: 5000,
                }
            );
            return;
        }

        const fullName = e.target.name.value;
        const email = e.target.email.value;
        const photoUrl = e.target.photoUrl.value;
        setLoading(true);

        const registerBody = {
            email: email,
            username: fullName,
            profilePicture:
                photoUrl === ""
                    ? "https://i.ibb.co.com/tQ1tBdV/dummy-profile-picture.jpg"
                    : photoUrl,
            password,
        };

        try {
            const serverResponse = await (
                await fetch(`${import.meta.env.VITE_SERVER_URL}/register`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(registerBody),
                })
            ).json();

            if (serverResponse.success) {
                toast.success("Registration Successful!");
                setUserAuthData(serverResponse);
            } else {
                toast.error(serverResponse.message);
            }
        } catch (error) {
            toast.error("Failed to create user!");
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <section className="">
            <Helmet>
                <title>Create new Account | Alternative Seek</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center sm:px-6 py-8 mx-auto">
                <h3 className="flex items-center mb-6 text-2xl font-semibold dark:text-white font-lato">
                    Hello There!
                </h3>
                <div className="rounded-lg shadow-lg border md:mt-0 sm:w-[34rem] xl:p-0 dark:bg-gray-700 border-gray-300 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8">
                            Create a New Account
                        </h1>

                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSignUp}
                        >
                            <div>
                                <label className="block text-sm font-medium dark:text-white">
                                    Your Full Name{" "}
                                    <span className="text-red-600">*</span>
                                    <input
                                        type="text"
                                        name="name"
                                        className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                                        placeholder="Mr XYZ"
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-white">
                                    Your Email{" "}
                                    <span className="text-red-600">*</span>
                                    <input
                                        type="email"
                                        name="email"
                                        className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-white">
                                    Your Profile Picture URL
                                    <input
                                        type="text"
                                        name="photoUrl"
                                        className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                                        placeholder="https://example.com/...."
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-white relative">
                                    Password{" "}
                                    <span className="text-red-600">*</span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder={
                                            showPassword ? "123456" : "••••••"
                                        }
                                        minLength={6}
                                        className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                                        required
                                        onChange={(e) =>
                                            (e.target.style.borderColor =
                                                "rgb(75 85 99)")
                                        }
                                    />
                                    <div
                                        className="absolute right-1 top-8 text-xl p-2 cursor-pointer"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <HiOutlineEyeOff />
                                        ) : (
                                            <HiOutlineEye />
                                        )}
                                    </div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                name="submit"
                                className={`w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                                    loading ? "cursor-not-allowed" : ""
                                }`}
                                disabled={loading}
                            >
                                Sign Up
                            </button>
                            <p className="text-sm font-light dark:text-gray-400">
                                Already have an Account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium hover:underline text-[#3b82f6] pl-4"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;

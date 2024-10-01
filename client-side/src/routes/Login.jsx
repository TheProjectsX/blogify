import { useContext, useState } from "react";
import { Link } from "react-router-dom";

// Icons
import { FcGoogle } from "react-icons/fc";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

// React Toast
import { toast } from "react-toastify";

// Firebase Auth Provider
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import auth from "../firebase/config";

// React Helmet
import { Helmet } from "react-helmet";
import UserDataContext from "../context/context";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const context = useContext(UserDataContext);
    const { setDataLoading } = context;

    // Login using Google
    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (userData) => {
                setDataLoading(true);

                const serverSignUp = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/authentication`,
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email: userData.user.email }),
                    }
                );
                const data = await serverSignUp.json();
                setDataLoading(false);
                if (data.success) {
                    toast.success("Login Successful!");
                } else {
                    toast.error("Error Logging in!");
                }
            })
            .catch((error) => console.error(error));
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(async () => {
                setDataLoading(true);
                const serverSignUp = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}/authentication`,
                    {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ email }),
                    }
                );
                const data = await serverSignUp.json();
                setDataLoading(false);
                if (data.success) {
                    toast.success("Login Successful!");
                } else {
                    toast.error("Error Logging in!");
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    toast.error("Incorrect Credentials!");
                    setLoading(false);
                } else if (error.code === "auth/too-many-requests") {
                    toast.error("Too many Invalid Login attempts!");
                    setLoading(false);
                } else {
                    toast.error("Error Ocurred in the Server");
                    setLoading(false);
                }
            });
    };

    return (
        <section className=" dark:bg-gray-800">
            <Helmet>
                <title>Login to Your Account | Crafted Gems</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center sm:px-6 py-8 mx-auto">
                <h3 className="flex items-center mb-6 text-2xl font-semibold dark:text-white font-lato">
                    Welcome Back!
                </h3>
                <div className="rounded-lg shadow-lg border md:mt-0 sm:w-[34rem] xl:p-0 dark:bg-gray-700 border-gray-300 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8">
                            Login to Your Account
                        </h1>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                className="px-6 py-2.5 flex justify-center items-center gap-2 border border-[#4b5563] rounded-lg hover:bg-gray-200 dark:hover:bg-[#374151] dark:text-white dark:hover:text-gray-200"
                                onClick={handleGoogleLogin}
                            >
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </button>
                        </div>
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="flex-shrink mx-4 dark:text-gray-400">
                                Or
                            </span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleLogin}
                        >
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
                            <div className="flex items-center justify-between">
                                <div className="ml-3 text-sm">
                                    <label className="dark:text-gray-300 items-center flex gap-2">
                                        <input
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-[#2563eb] ring-offset-gray-800"
                                            required=""
                                        />
                                        Remember me
                                    </label>
                                </div>
                                <a className="text-sm font-medium hover:underline text-[#3b82f6] cursor-pointer">
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                name="submit"
                                className={`w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                                    loading ? "cursor-not-allowed" : ""
                                }`}
                                disabled={loading}
                            >
                                Login
                            </button>
                            <p className="text-sm font-light dark:text-gray-400">
                                Don’t have an account yet?{" "}
                                <Link
                                    to="/sign-up"
                                    className="font-medium hover:underline text-[#3b82f6] pl-4"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

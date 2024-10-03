import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// React Router Dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./routes/Home.jsx";
import Post from "./routes/Post.jsx";
import About from "./routes/About.jsx";
import Dashboard from "./routes/Dashboard.jsx";
import EditPost from "./routes/EditPost.jsx";
import Users from "./routes/Users.jsx";

// Quill Theme
// import "react-quill/dist/quill.snow.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: () =>
                    fetch(`${import.meta.env.VITE_SERVER_URL}/posts?limit=6`),
            },
            {
                path: "/post/:postId",
                element: <Post />,
                loader: async ({ params }) => [
                    await (
                        await fetch(
                            `${import.meta.env.VITE_SERVER_URL}/posts/${
                                params.postId
                            }`
                        )
                    ).json(),
                    await (
                        await fetch(`${import.meta.env.VITE_SERVER_URL}/posts`)
                    ).json(),
                ],
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/login",
                element: (
                    <PrivateRoute reverse>
                        <Login />
                    </PrivateRoute>
                ),
            },
            {
                path: "/register",
                element: (
                    <PrivateRoute reverse>
                        <Register />
                    </PrivateRoute>
                ),
            },
            {
                path: "/me",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
                loader: () =>
                    fetch(`${import.meta.env.VITE_SERVER_URL}/me/posts`, {
                        credentials: "include",
                    }),
            },
            {
                path: "/me/new",
                element: (
                    <PrivateRoute>
                        <EditPost />
                    </PrivateRoute>
                ),
            },
            {
                path: "/me/edit/:postId",
                element: (
                    <PrivateRoute>
                        <EditPost />
                    </PrivateRoute>
                ),
                loader: ({ params }) =>
                    fetch(
                        `${import.meta.env.VITE_SERVER_URL}/posts/${
                            params.postId
                        }`
                    ),
            },
            {
                path: "/admin/users",
                element: (
                    <PrivateRoute admin>
                        <Users />
                    </PrivateRoute>
                ),
                loader: () =>
                    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users`, {
                        credentials: "include",
                    }),
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

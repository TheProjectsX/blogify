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
import "quill/dist/quill.snow.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: () => fetch(`${import.meta.env.VITE_SERVER_URL}/posts`),
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
            // {
            //     path: "/update-profile",
            //     element: (
            //         <PrivateRoute>
            //             <UpdateProfile />
            //         </PrivateRoute>
            //     ),
            // },
            // {
            //     path: "/queries",
            //     element: <Queries />,
            //     loader: async () => [
            //         await (
            //             await fetch(
            //                 `${import.meta.env.VITE_SERVER_URL}/queries?limit=9`
            //             )
            //         ).json(),
            //         await (
            //             await fetch(
            //                 `${import.meta.env.VITE_SERVER_URL}/queries/count`
            //             )
            //         ).json(),
            //     ],
            // },
            // {
            //     path: "/query-details/:queryId",
            //     element: <QueryDetails />,
            //     loader: async ({ params }) => [
            //         await (
            //             await fetch(
            //                 `${import.meta.env.VITE_SERVER_URL}/queries/${
            //                     params.queryId
            //                 }`
            //             )
            //         ).json(),
            //         await (
            //             await fetch(
            //                 `${
            //                     import.meta.env.VITE_SERVER_URL
            //                 }/recommendations?queryId=${params.queryId}`
            //             )
            //         ).json(),
            //     ],
            // },
            // {
            //     path: "/me/recommendations-for-me",
            //     element: (
            //         <PrivateRoute>
            //             <RecommendationsForMe />
            //         </PrivateRoute>
            //     ),
            //     loader: async () => {
            //         const res = await fetch(
            //             `${
            //                 import.meta.env.VITE_SERVER_URL
            //             }/me/recommendations/for-me`,
            //             {
            //                 credentials: "include",
            //             }
            //         );
            //         const data = await res.json();
            //         if (data.success) {
            //             return data.result;
            //         } else {
            //             await logoutUser();
            //             return null;
            //         }
            //     },
            // },
            // {
            //     path: "/me/queries",
            //     element: (
            //         <PrivateRoute>
            //             <MyQueries />
            //         </PrivateRoute>
            //     ),
            //     loader: async () => {
            //         const res = await fetch(
            //             `${import.meta.env.VITE_SERVER_URL}/me/queries`,
            //             {
            //                 credentials: "include",
            //             }
            //         );
            //         const data = await res.json();
            //         if (data.success) {
            //             return data.result;
            //         } else {
            //             await logoutUser();
            //             return null;
            //         }
            //     },
            // },
            // {
            //     path: "/me/recommendations",
            //     element: (
            //         <PrivateRoute>
            //             <MyRecommendations />
            //         </PrivateRoute>
            //     ),
            //     loader: async () => {
            //         const res = await fetch(
            //             `${import.meta.env.VITE_SERVER_URL}/me/recommendations`,
            //             {
            //                 credentials: "include",
            //             }
            //         );
            //         const data = await res.json();
            //         if (data.success) {
            //             return data.result;
            //         } else {
            //             await logoutUser();
            //             return null;
            //         }
            //     },
            // },
            // {
            //     path: "/create-query",
            //     element: (
            //         <PrivateRoute>
            //             <EditQuery />
            //         </PrivateRoute>
            //     ),
            // },
            // {
            //     path: "/edit-query/:queryId",
            //     element: (
            //         <PrivateRoute>
            //             <EditQuery />
            //         </PrivateRoute>
            //     ),
            //     loader: async ({ params }) => {
            //         const res = await fetch(
            //             `${import.meta.env.VITE_SERVER_URL}/queries/${
            //                 params.queryId
            //             }`,
            //             {
            //                 credentials: "include",
            //             }
            //         );
            //         const data = await res.json();
            //         if (
            //             res.status === 200 ||
            //             res.status === 404 ||
            //             res.status === 400
            //         ) {
            //             return data;
            //         } else {
            //             await logoutUser();
            //             return null;
            //         }
            //     },
            // },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

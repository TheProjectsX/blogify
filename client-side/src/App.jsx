// Components
import UserDataContext from "./context/context";
import NavbarComponent from "./components/Navbar";
import FooterComponent from "./components/Footer";
import { Outlet } from "react-router-dom";

// React Toast
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useReducer, useState } from "react";

function App() {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const [dataLoading, setDataLoading] = useState(true);
    const [userAuthData, setUserAuthData] = useState(null);

    // Auth Change Effect
    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setUserAuthData(result);
                }
                setDataLoading(false);
            });
    }, []);

    return (
        <>
            <ToastContainer
                position="top-left"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="max-width !p-0 font-ubuntu dark:bg-gray-800">
                <UserDataContext.Provider
                    value={{
                        userAuthData,
                        setUserAuthData,
                        dataLoading,
                        setDataLoading,
                        forceUpdate,
                    }}
                >
                    <NavbarComponent />
                    <main className="space-y-8 dark:bg-gray-900 mb-4">
                        <Outlet />
                    </main>
                    <FooterComponent />
                </UserDataContext.Provider>
            </div>
        </>
    );
}

export default App;

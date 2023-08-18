import { Routes, Route } from "react-router-dom";
import RequireUser from "./Components/RequireUser";
import LoadingBar from "react-top-loading-bar";
import toast, { Toaster } from "react-hot-toast";
import RequireIfNoLogin from "./Components/RequirIfNoLogin";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import UserChats from "./Components/userchats/UserChats";
import SearchBox from "./Components/searchBox/SearchBox";
import GroupChat from "./Components/groupChat/GroupChat";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

function App() {
    const isBarLoading = useSelector(
        (state) => state.appConfigReducer.isBarLoading
    );
    const toastData = useSelector((state) => state.appConfigReducer.toastData);

    const loadingRef = useRef(null);

    useEffect(() => {
        if (isBarLoading) {
            loadingRef.current?.continuousStart();
        } else {
            loadingRef.current?.complete();
        }
    }, [isBarLoading]);

    useEffect(() => {
        switch (toastData.type) {
            case TOAST_SUCCESS:
                toast.success(toastData.message);
                break;
            case TOAST_FAILURE:
                toast.error(toastData.message);
                break;
            default:
                break;
        }
    }, [toastData]);

    return (
        <div className="App">
            <LoadingBar
                color="linear-gradient(to right, #727fe7, #9474e7)"
                height={4}
                ref={loadingRef}
            />
            <div>
                <Toaster />
            </div>
            <Routes>
                <Route element={<RequireUser />}>
                    <Route element={<Home />}>
                        <Route path="/" element={<UserChats />} />
                        <Route path="/search" element={<SearchBox />} />
                        <Route path="/group" element={<GroupChat />} />
                    </Route>
                </Route>

                <Route element={<RequireIfNoLogin />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;

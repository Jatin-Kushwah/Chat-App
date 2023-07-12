import { Routes, Route } from "react-router-dom";
import RequireUser from "./Components/RequireUser";
import RequireIfNoLogin from "./Components/RequirIfNoLogin";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import UserChats from "./Components/userchats/UserChats";
import SearchBox from "./Components/searchBox/SearchBox";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route element={<RequireUser />}>
                    <Route element={<Home />}>
                        <Route path="/" element={<UserChats />} />
                        <Route path="/search" element={<SearchBox />} />
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

import ProfileSetup from "./components/ProfileSetup";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "./assets/main.scss";
import LoginForm from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import SignupForm from "./components/SignupForm";
import { useAppDispatch, useAppSelector } from "./app/hooks";

import Header from "./components/Header";
import {
    fetchMe,
    selectToken,
    setToken,
    setAuthChecked,
} from "./features/user/userSlice";
import { useEffect } from "react";
import DiaryPage from "./components/FoodSearchModal/DiaryPage";
import Learning from "./components/Learning/learning";

function App() {
    const dispatch = useAppDispatch();
    const { token, authChecked } = useAppSelector((s) => ({
        token: s.user.token,
        authChecked: s.user.authChecked,
    }));
    const isAuthenticated = !!token;

    useEffect(() => {
        const saved = localStorage.getItem("token");
        if (saved) {
            dispatch(setToken(saved)); // sets Redux + writes localStorage
            dispatch(fetchMe()); // flips authChecked in its handlers
        } else {
            dispatch(setAuthChecked()); // NO thunk—just mark “we’re done checking”
        }
    }, [dispatch]);

    // While we’re waiting on fetchMe…
    if (!authChecked && localStorage.getItem("token")) {
        return <div>Loading…</div>;
    }

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                    path="/profile"
                    element={
                        isAuthenticated ? (
                            <ProfileSetup />
                        ) : (
                            <Navigate to={"/login"} replace />
                        )
                    }
                />
                <Route
                    path="/learning"
                    element={
                        isAuthenticated ? (
                            <Learning />
                        ) : (
                            <Navigate to={"/login"} replace />
                        )
                    }
                />
                <Route
                    path="/diary"
                    element={
                        isAuthenticated ? (
                            <DiaryPage />
                        ) : (
                            <Navigate to={"/login"} replace />
                        )
                    }
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Dashboard />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="/signup" element={<SignupForm />} />

                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <Dashboard />
                        ) : (
                            <Navigate to={"/login"} replace />
                        )
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={isAuthenticated ? "/dashboard" : "/login"}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;

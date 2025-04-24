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
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { loadUserFromToken } from "./features/user/loadUserFromToken";
import Header from "./components/Header";

function App() {
    const dispatch = useAppDispatch();
    const isAuthenticated = !!localStorage.getItem("token");
    useEffect(() => {
        loadUserFromToken(dispatch);
    });
    return (
        <Router>
            <Header/>
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

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
import { useEffect } from "react";

import Header from "./components/Header";
import { fetchMe, selectToken, setToken } from "./features/user/userSlice";

function App() {
    const dispatch = useAppDispatch();
   const token = useAppSelector(selectToken);
  const isAuthenticated = !!token;

  useEffect(() => {
    // on initial load, hydrate from localStorage
    const saved = localStorage.getItem("token");
    if (saved) {
      dispatch(setToken(saved));
      dispatch(fetchMe());
    }
  }, [dispatch]);
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

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
import { fetchMe, selectToken, setToken } from "./features/user/userSlice";
import { useEffect } from "react";

function App() {
    
    const dispatch = useAppDispatch();

  // pull token & authChecked from Redux
  const { token, authChecked } = useAppSelector((s) => ({
    token: s.user.token,
    authChecked: s.user.authChecked
  }));
  const isAuthenticated = !!token;

  // 🔄 bootstrap on mount
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      // 1️⃣ rehydrate Redux
      dispatch(setToken(saved));
      // 2️⃣ fetch the current user (will flip authChecked on fulfilled/rejected)
      dispatch(fetchMe());
    } else {
      // no token → nothing to fetch, mark checked
      // dispatch a no-op that just flips authChecked
      dispatch({ type: fetchMe.rejected.type, payload: "no-token" });
    }
  }, [dispatch]);

  // if we’re still waiting on fetchMe() (and we did have a token), show loading
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

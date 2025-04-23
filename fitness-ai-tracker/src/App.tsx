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

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                <Route path ='/login' element={<LoginForm/>} />
                <Route path ='/profile' element={isAuthenticated ? <ProfileSetup/>: 
                <Navigate to={'/login'} replace/>}  />

                <Route path="/dashboard"
                element={
                    isAuthenticated ? <Dashboard/> : <Navigate to={'/login'} replace/>
                }/>

                <Route path="*" />
            </Routes>
        </Router>
    );
}

export default App;

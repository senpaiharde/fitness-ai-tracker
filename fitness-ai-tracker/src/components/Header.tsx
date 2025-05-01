import { useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    VscSignOut,
    VscSettingsGear,
    VscAccount,
    VscHome,
} from "react-icons/vsc";
import { logout, selectToken, selectUser } from "../features/user/userSlice";
import Dock from "./utilsCalls/Dock";
import { FC, useMemo } from "react";
import HoverScaleText from "./utilsCalls/HoverScaleText";

const Header: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const isLoggedIn = !!token;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
    };

    const dockItems = useMemo(
        () =>
            [
                {
                    icon: <VscHome size={18} />,
                    label: "Dashboard",
                    onClick: () => navigate("/"),
                },
                {
                    icon: <VscAccount size={18} />,
                    label: user?.fullname ?? "Profile",
                    onClick: () => navigate("/profile"),
                },
                {
                    icon: <VscSettingsGear size={18} />,
                    label: "Settings",
                    onClick: () => navigate("/settings"),
                },
                {
                    icon: <VscSignOut size={18} />,
                    label: "Logout",
                    onClick: handleLogout,
                },
            ] as const,
        [navigate, handleLogout, user?.fullname]
    );

    return (
        <header className="lt-header">
            <h1 className="lt-brand">
                <HoverScaleText>lifeTracker</HoverScaleText>
            </h1>
            {isLoggedIn ? (
                <Dock
                    items={dockItems}
                    className="lt-dock"
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={70}
                />
            ) : (
                <div className="lt-auth-links">
                    <Link to="/login">Login</Link>
                    <span>|</span>
                    <Link to="/signup">Sign&nbsp;Up</Link>
                </div>
            )}
        </header>
    );
};

export default Header;

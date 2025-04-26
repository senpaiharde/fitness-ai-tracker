import React from "react";

import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { updateProfile } from "../features/user/userSlice";
import type { FC, JSX } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./utilsCalls/LogoutButton";


// fc its funcinal component and jsx.element its gonna incloud jsx
const ProfileSetup: FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [isEnchaned, setisEnchaned] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const profileData = {
            age: typeof age === "number" ? age : undefined,
            weight: typeof weight === "number" ? weight : undefined,
            height: typeof height === "number" ? height : undefined,
            isEnchaned,
        };

        dispatch(updateProfile(profileData));

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Missing token. Please login again.");
            navigate("/login");
            return;
        }

        try {
           updateProfile( profileData);
            navigate("/profile");
        } catch (err: any) {
            alert(err.message || "Failed to update profile");
        }
        alert('updated porfile')
    };
     

    const hanldeNavigate  =() => {
        navigate('/dashboard');


    }
    return (
        <div style={{ padding: "2rem" }} className="">
            <h2>Profile Setup</h2>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <input
                    type="number"
                    placeholder="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Height (em)"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isEnchaned}
                        onChange={() => setisEnchaned(!isEnchaned)}
                    />
                    Enhanced (steroids/sarms)
                </label>
                <button type="submit">Save Profile</button>
            </form>
            <LogoutButton />
            <button onClick={hanldeNavigate}>dashboard</button>
        </div>
    );
};

export default ProfileSetup;

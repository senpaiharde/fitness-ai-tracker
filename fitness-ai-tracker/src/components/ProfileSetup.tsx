import React from "react";

import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { updateProfile, login } from "../features/user/userSlice";
import type { FC, JSX } from "react";
const ProfileSetup: FC = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [isEnchanded, setIsEnchanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(login({ id: "u123", email: "you@gmail.com" }));

        dispatch(
            updateProfile({
                age: typeof age === "number" ? age : undefined,
                weight: typeof weight === "number" ? weight : undefined,
                height: typeof height === "number" ? height : undefined,
                isEnchanded,
            })
        );
    };
    return(
        <div style={{padding:'2rem'}} className="">
            
        </div>
    )
};

export default ProfileSetup;
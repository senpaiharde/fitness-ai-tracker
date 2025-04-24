import React from "react";

import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { updateProfile,  } from "../features/user/userSlice";
import type { FC, JSX } from "react";
import {  useNavigate } from "react-router-dom";

// fc its funcinal component and jsx.element its gonna incloud jsx
const ProfileSetup: FC = (): JSX.Element => {  
    const dispatch = useAppDispatch();

    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [isEnchanded, setIsEnchanded] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        
        dispatch(
            updateProfile({
                age: typeof age === "number" ? age : undefined,
                weight: typeof weight === "number" ? weight : undefined,
                height: typeof height === "number" ? height : undefined,
                isEnchanded,
            })
        );
        //navigate('/dashboard')
        navigate('/profile')
    };
    
    return(
        <div style={{padding:'2rem'}} className="">
            <h2>Profile Setup</h2>
            <form onSubmit={handleSubmit} 
            style={{display:'flex',
                flexDirection:'column',
                gap:'1rem'
            }}>
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
                
                checked={isEnchanded}
                onChange={() => setIsEnchanded(!isEnchanded)}
                />
                Enhanced (steroids/sarms)
                </label>
                <button type="submit">Save Profile</button>

            </form>
        </div>
    )
};

export default ProfileSetup;
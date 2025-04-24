import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import { useState } from "react";




export const EnhancementLog = (Isopen: boolean, ) => {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)
    
    const [compound, setCompound] = useState('');
    const [dose,setDose] = useState<number | "">("");
    const [time, setTime] =useState('');
    const [goal, setGoal] = useState('');



   const handleAddLog = () => {
    if(!compound || !dose || ! time) return;
    
    
    const newLog = {
        compound,
        dose: Number(dose),
        time: time,
        goal,
    };
    dispatch
   }

 

    return (
        <div>
             {Isopen && (
                <div>
                    <h2>Edit Your logs {user?.user?.name} || user</h2>
                    <form onSubmit={}></form>
                </div>
             )}
        </div>
    )
}
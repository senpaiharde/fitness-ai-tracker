import { Link, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { EnhancementLog } from "./../EnhancementLog";

import Shiny from "../../ui/Shiny";
import ShinyButton from "../../ui/ShinyButtton";
import Schedule from "../Schedule";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectToken, selectUser } from "../../features/user/userSlice";

import DiaryPage from "./../FoodSearchModal/DiaryPage";
import Learning from "./../Learning/learning";
import { SvgArrow, SvgMicro, SvgPlus } from "./SvgBox.jsx";

type Answer =
    | { type: "user"; payload: string }
    | { type: "ack"; payload: string }
    | { type: "chat"; payload: string }
    | { type: "suggestion"; payload: string }
    | {
          type: "logs";
          payload: {
              loaded: string[];
              logs: Record<string, any[]>;
          };
      };

export const AiForm = () => {
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const isLoggedIn = Boolean(token);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showLogs, setShowLogs] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [answers]);







    const API_BASE = "http://localhost:4000";
    const handleChatAI = async () => {
        if (!text.trim()) return alert("fill the text");
        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE}/ai/intake/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });
            const body = await resp.json();
            if (!resp.ok) throw new Error(body.error || "AI call failed");
            setAnswers((prev) => [...prev, ...(body.answers as Answer[])]);
        } catch (err: any) {
            console.error("err at creating chat with ai:", err);
            alert("failed to create chat: " + err.message);
        } finally {
            setLoading(false);
            
        }
    };
    return (
        <div className="AiChat">
            {isLoggedIn && (
                <>
                    <nav className="sidebarLeft">2</nav>
                    <div className="MainChat">
                        <h2 className="MainChatH2">Ready when you are.</h2>
                        <div className="MainChatContainer">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Ask anything"
                                className="MainChatInput"
                            />
                            <div className="MainChatContainerBottonArea">
                                <div>
                                    <button
                                        title="Add photos and files"
                                        className="MainChatContainerButtonAdd"
                                    >
                                        <SvgPlus />
                                    </button>
                                </div>

                                <div>
                                    <button
                                        title="Add photos and files"
                                        className="MainChatContainerButtonAdd"
                                    >
                                        <SvgMicro />
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleChatAI();
                                        }}
                                        className="MainChatContainerButton"
                                    >
                                        <SvgArrow />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

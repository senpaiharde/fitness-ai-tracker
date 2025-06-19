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
    const hasHistory = answers.length > 0;
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [answers]);

    const API_BASE = "http://localhost:4000";
    const handleChatAI = async () => {
        console.log("text", text);
        const userText = text.trim();
        if (!userText) return alert("fill the text form");
        setAnswers((prev) => [...prev, { type: "user", payload: userText }]);
        setText("");
        setLoading(true);
        try {
            const resp = await fetch(`${API_BASE}/ai/intake/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userText }),
            });
            const body = await resp.json();
            if (!resp.ok) throw new Error(body.error || "AI call failed");

          
            const apiAnswers = Array.isArray(body.answers)
                ? (body.answers as Answer[])
                : [];
            if (!Array.isArray(body.answers)) {
                console.warn("Expected body.answers array, got:", body.answers);
            }
            setAnswers((prev) => [...prev, ...apiAnswers]);
        } catch (err: any) {
            console.error("Ai Error:", err);
            alert("Error" + err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="AiChat">
            {isLoggedIn && (
                <>
                    <nav className="sidebarLeft"></nav>
                    <div className="MainChat">
                        {hasHistory ? (
                            <>
                                {/*) Chat history */}
                                <div className="chat-history">
                                    {answers?.map((ans, i) => {
                                        switch (ans.type) {
                                            case "user":
                                                return (
                                                    <div
                                                        key={i}
                                                        className="msgUser"
                                                    >
                                                        {ans.payload}
                                                    </div>
                                                );
                                            case "ack":
                                            case "chat":
                                            case "suggestion":
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`msgAi ${ans.type}`}
                                                    >
                                                        {ans.payload}
                                                    </div>
                                                );
                                            case "logs":
                                                return (
                                                    <div
                                                        key={i}
                                                        className="logsEntry"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setShowLogs(
                                                                    (s) => !s
                                                                )
                                                            }
                                                        >
                                                            {showLogs
                                                                ? "Hide Logs"
                                                                : "Show Logs"}
                                                        </button>
                                                        {showLogs &&
                                                            ans.payload.loaded.map(
                                                                (cat) => (
                                                                    <div
                                                                        key={
                                                                            cat
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            {
                                                                                cat
                                                                            }
                                                                        </h4>
                                                                        <ul>
                                                                            {(
                                                                                ans
                                                                                    .payload
                                                                                    .logs[
                                                                                    cat
                                                                                ] ||
                                                                                []
                                                                            ).map(
                                                                                (
                                                                                    log,
                                                                                    j
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            j
                                                                                        }
                                                                                    >
                                                                                        {log.summary ??
                                                                                            JSON.stringify(
                                                                                                log
                                                                                            )}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                );
                                            default:
                                                return null;
                                        }
                                    })}
                                    <div ref={endRef} />
                                </div>

                                <div className="MainChatContainer">
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) =>
                                            setText(e.target.value)
                                        }
                                        placeholder="Ask anything"
                                        className="MainChatInput"
                                        disabled={loading}
                                    />
                                    <div className="MainChatContainerBottonArea">
                                        <div>
                                            <button className="MainChatContainerButtonAdd">
                                                <SvgPlus />
                                            </button>
                                        </div>
                                        <div>
                                            <button className="MainChatContainerButtonAdd">
                                                <SvgMicro />
                                            </button>
                                            <button
                                                onClick={handleChatAI}
                                                className="MainChatContainerButton"
                                                disabled={
                                                    loading || !text.trim()
                                                }
                                            >
                                                <SvgArrow />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="MainChatH2">
                                    Ready when you are.
                                </h2>
                                <div className="Container">
                                    <div className="MainChatContainer">
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) =>
                                                setText(e.target.value)
                                            }
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
                </>
            )}
        </div>
    );
};

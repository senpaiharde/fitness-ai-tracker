// src/components/ProfileSetup.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateProfile, selectUser } from "../features/user/userSlice";
import { useNavigate, Link } from "react-router-dom";

export default function ProfileSetup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);

    // Local form state, initialized when `user` arrives
    const [fullname, setFullname] = useState("");
    const [birthdate, setBirthdate] = useState(""); // ISO date string
    const [weightKg, setWeightKg] = useState<number | "">("");
    const [bodyFat, setBodyFat] = useState<number | "">("");
    const [goals, setGoals] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [notifEmail, setNotifEmail] = useState(false);
    const [notifPush, setNotifPush] = useState(false);
    const [uiTheme, setUiTheme] = useState<"light" | "dark">("light");
    const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    // When the user object arrives, populate the form
    useEffect(() => {
        if (user) {
            setFullname(user.fullname);
            setBirthdate(user.birthdate?.slice(0, 10) ?? "");
            setWeightKg(user.weightKg ?? "");
            setBodyFat(user.baselineBodyFatPercent ?? "");
            setGoals(user.goals?.join(", "));
            setTimeZone(user.timeZone);
            setNotifEmail(user.notificationPrefs?.email);
            setNotifPush(user.notificationPrefs?.push);
            setUiTheme(user.uiTheme);
        }
    }, [user]);

    if (!user) {
        // Not logged in
        return (
            <div>
                <p>
                    Please <Link to="/login">log in</Link> first.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("saving");
        setError(null);

        const payload = {
            fullname,
            birthdate: birthdate || undefined,
            weightKg: typeof weightKg === "number" ? weightKg : undefined,
            baselineBodyFatPercent:
                typeof bodyFat === "number" ? bodyFat : undefined,
            goals: goals
                .split(",")
                .map((g) => g.trim())
                .filter((g) => g),
            timeZone,
            notificationPrefs: { email: notifEmail, push: notifPush },
            uiTheme,
            updatedAt: Date.now()
        };

        try {
            await dispatch(updateProfile(payload)).unwrap();
            setStatus("idle");
            navigate("/dashboard");
        } catch (err: any) {
            setStatus("error");
            setError(err);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 500, margin: "auto" }}>
            <h2>Profile Settings</h2>
            <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gap: "1rem" }}
            >
                <label>
                    Full Name
                    <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Email 
                    <input type="email" value={user.email} readOnly />
                </label>

                <label>
                    Birthdate
                    <input
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                    />
                </label>

                <label>
                    Weight  (kg)
                    <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        min={0}
                    />
                </label>

                <label>
                    Body Fat %
                    <input
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(Number(e.target.value))}
                        min={0}
                        max={100}
                    />
                </label>

                <label>
                    Goals (comma-separated)
                    <input
                        type="text"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                    />
                </label>

                <label>
                    Time Zone
                    <input
                        type="text"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                    />
                </label>

                <fieldset>
                    <legend>Notifications</legend>
                    <label>
                        <input
                            type="checkbox"
                            checked={notifEmail}
                            onChange={() => setNotifEmail((f) => !f)}
                        />{" "}
                        Email
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={notifPush}
                            onChange={() => setNotifPush((f) => !f)}
                        />{" "}
                        Push
                    </label>
                </fieldset>

                <fieldset>
                    <legend>UI Theme</legend>
                    <label>
                        <input
                            type="radio"
                            name="uiTheme"
                            value="light"
                            checked={uiTheme === "light"}
                            onChange={() => setUiTheme("light")}
                        />{" "}
                        Light
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="uiTheme"
                            value="dark"
                            checked={uiTheme === "dark"}
                            onChange={() => setUiTheme("dark")}
                        />{" "}
                        Dark
                    </label>
                </fieldset>

                {status === "error" && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={status === "saving"}>
                    {status === "saving" ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export const loginUser = async (
    email: string,
    password: string
): Promise<string> => {
    const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
    }

    const data = await res.json();
    return data.token;
};

export const getMe = async (token: string): Promise<any> => {
    const res = await fetch("http://localhost:4000/user/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch user");
    }

    const userData = await res.json();
    const flattenedUser = {
        id: userData.id,
        email :userData.email,
        name:userData.name,
        ...userData.profile,
    }
    return flattenedUser
};

export const updateProfileSettings = async (
    token: string,
    profileData: any
): Promise<any> => {
    const res = await fetch("http://localhost:4000/user/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "failed to update user");
    }

    return res.json();
};


export const updateLogSettings = async (
    token: string,
    profileData: any
): Promise<any> => {
    const res = await fetch("http://localhost:4000/user/log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "failed to update user");
    }

    return res.json();
};


/* export const deleteLog = async (
    token: string,
    profileData: any,
): Promise<any> => {
    const res = await fetch(`http://localhost:4000/user/log/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData.id),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "failed to remove log");
    }

    return res.json();
};
*/
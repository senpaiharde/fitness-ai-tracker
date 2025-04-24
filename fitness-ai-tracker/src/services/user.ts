export const getMe = async (token:string): Promise<any> => {
    const res = await fetch('http://localhost:4000/user/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch user');
        
    }

    return res.json();
}
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/';

const handleResponse = async (response: Response) => {
    const rawText = await response.text(); // ✅ Only read once

    let data;
    try {
        data = JSON.parse(rawText); // ✅ Try to parse
    } catch (err) {
        console.error("❌ Failed to parse JSON. Raw response:", rawText);
        throw new Error("Failed to parse JSON response.");
    }

    return {
        success: response.ok,
        data: response.ok ? data : null,
        error: !response.ok ? data?.error || { message: 'Something went wrong' } : null,
    };
};

const api = {
  get: async (url: string, token?: string) => {
    console.log(`📡 Fetching: ${BASE_URL}${url}`); // ✅ log the full URL
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    return handleResponse(res);
},

    post: async (url: string, body: any, token?: string) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    put: async (url: string, body: any, token?: string) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    delete: async (url: string, token?: string) => {
        const res = await fetch(`${BASE_URL}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        return handleResponse(res);
    },
};

export default api;

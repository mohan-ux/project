export async function loginUser(username, password) {
    const response = await fetch("https://e-com-web-1.onrender.com/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    return data;
}

export async function fetchQuestions(token) {
    const response = await fetch("https://e-com-web-1.onrender.com/api/questions", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

import React, { useState } from "react";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://e-com-web-1.onrender.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.token) {
                setToken(data.token);
                fetchProducts(data.token);
            } else {
                setError("Login failed - no token received");
            }
        } catch (err) {
            setError("Login failed - " + err.message);
        }
    };

    const fetchProducts = async (authToken) => {
        try {
            const response = await fetch("https://e-com-web-1.onrender.com/api/products", {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError("Failed to fetch products - " + err.message);
        }
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    return (
        <div style={{ padding: "20px" }}>
            {!token ? (
                <div>
                    <h1>Login</h1>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: "8px", margin: "5px" }}
                        /><br />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "8px", margin: "5px" }}
                        /><br />
                        <button type="submit" style={{ padding: "8px 20px" }}>
                            Login
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Products</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        {products.map((product) => (
                            <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                                <h3>{product.name}</h3>
                                <p>${product.price}</p>
                                <button onClick={() => addToCart(product)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                    
                    <h2>Shopping Cart</h2>
                    <div>
                        {cart.map((item, index) => (
                            <div key={index} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
                                <h4>{item.name}</h4>
                                <p>${item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

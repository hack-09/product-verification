// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Login() {
const { signIn } = useAuth();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        await signIn(email.trim(), password);
        navigate("/dashboard");
    } catch (err) {
        setError(err.message || "Failed to log in");
    } finally {
        setLoading(false);
    }
};


return (
    <div className="container">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} className="card">
            {error && <p className="error">{error}</p>}
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
);
}
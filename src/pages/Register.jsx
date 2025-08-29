// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Register() {
const { signUp } = useAuth();
const navigate = useNavigate();
const [displayName, setDisplayName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        await signUp(email.trim(), password, displayName.trim());
        navigate("/dashboard");
    } catch (err) {
        setError(err.message || "Failed to register");
    } finally {
        setLoading(false);
    }
};


return (
    <div className="container">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit} className="card">
            {error && <p className="error">{error}</p>}
            <label>Name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
);
}
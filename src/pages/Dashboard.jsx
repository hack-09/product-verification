// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();


    const handleSignOut = async () => {
        await signOutUser();
        navigate("/login");
    };


    return (
        <div className="container">
            <h1>Dashboard</h1>
            <p>Welcome {user?.displayName || user?.email}</p>
            <button onClick={handleSignOut}>Sign out</button>
            <div className="card" style={{ marginTop: 16 }}>
                <p>This is where you'll add the product creation & QR generation next.</p>
            </div>
        </div>
    );
}
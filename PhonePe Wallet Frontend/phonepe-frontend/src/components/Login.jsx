import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const payload = {
                phoneNumber: phone,
                pin: pin
            };

            const res = await api.post("/users/login", payload);

            localStorage.setItem("upiId", res.data.data.upiId);
            localStorage.setItem("name", res.data.data.name);

            navigate("/dashboard");
        } catch (err) {
            console.error(err.response?.data);
            alert("Invalid credentials");
        }
    };


    return (
        <div className="card">
            <h2 style={{color:"orange"}}>Phone Pay Wallet</h2>
            <h2>Login</h2>

            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                    id="phone"
                    placeholder="Enter your phone number"
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="pin">PIN</label>
                <input
                    id="pin"
                    type="password"
                    placeholder="Enter PIN"
                    onChange={e => setPin(e.target.value)}
                />
            </div>

            <button onClick={handleLogin}>Login</button>

            <p onClick={() => navigate("/register")}>
                Register
            </p>
        </div>
    );
}

export default Login;

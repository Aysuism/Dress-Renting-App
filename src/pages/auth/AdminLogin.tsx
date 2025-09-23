import { useState } from "react";
import { useLoginMutation } from "../../tools/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    role: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

const AdminLogin: React.FC = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [login] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Submitting login:", formData);
            const response = await login(formData).unwrap();

            const { accessToken } = response as unknown as LoginResponse;
            console.log("AccessToken:", accessToken);

            const decoded = jwtDecode<JwtPayload>(accessToken);
            console.log("Decoded JWT:", decoded);
            console.log("role from token", decoded.role);


            if (decoded.role !== "ADMIN") {
                Swal.fire("Access Denied", "Only admin can login here", "error");
                return;
            }

            localStorage.setItem("token", accessToken);
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({ email: decoded.sub, role: decoded.role })
            );
            window.dispatchEvent(new Event("userLoggedIn"));

            Swal.fire("Success", "You are logged in!", "success");
            navigate("/admin-panel", { replace: true });
        } catch (err: any) {
            console.error("Login error:", err);
            Swal.fire("Error", err?.data?.message || "Invalid login response", "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg flex flex-col gap-4"
        >
            <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-semibold"
            >
                Login
            </button>
        </form>

    );
};

export default AdminLogin;
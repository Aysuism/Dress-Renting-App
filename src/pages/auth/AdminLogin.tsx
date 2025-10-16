import { useState } from "react";
import { useLoginMutation } from "../../tools/auth";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
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
    const location = useLocation();
    const state = location.state as { allowed?: boolean };

    // ❌ Block direct access
    if (!state?.allowed) {
        return <Navigate to="/" replace />;
    }

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await login(formData).unwrap();
            const { accessToken } = response as unknown as LoginResponse;

            const decoded = jwtDecode<JwtPayload>(accessToken);

            if (decoded.role !== "ADMIN") {
                Swal.fire("Access Denied", "Only admin can login here", "error");
                setIsLoading(false);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-[400px] h-[300px] mt-45 p-8 bg-white shadow-lg rounded-lg flex flex-col justify-between"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>

                <div className="grid gap-5">
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
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Giriş edilir..." : "Daxil ol"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
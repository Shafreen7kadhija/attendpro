import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://attendpro-backend.onrender.com/login",
        {
            email,
            password,
        }
    );

      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Login successful ✅");
      setTimeout(() => {
        const user = res.data;
        if (user.role === "student") {
            window.location.href = `/student-view/${user.id}`;
        } else {
            window.location.href = "/home";
        }
      }, 1000);

    } catch (err) {
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 
                          rounded-xl flex items-center justify-center text-white text-xl shadow">
            🎓
          </div>

          <h1 className="text-3xl font-bold mt-4 text-gray-800">
            AttendPro
          </h1>

          <p className="text-gray-500 text-sm">
            Online Attendance Management System
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-xl font-semibold text-center mb-1">
            Sign In
          </h2>

          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your credentials to continue
          </p>

          <form
            autoComplete="off"
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email Address</label>

            <div className="flex items-center border rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md transition">
              <span className="text-gray-400">📧</span>
              <input
                type="email"
                name="new-email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <label>Password</label>
              <span className="text-blue-600 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <div className="flex items-center border rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md transition">

              <span className="text-gray-400">🔒</span>

              <input
                 type={showPassword ? "text" : "password"}
                 name="new-password"
                 autoComplete="new-password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-3 outline-none"
                 placeholder="Enter password"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>

            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition duration-200 disabled:opacity-70"
          >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                </span>
            ) : (
            "Sign In"
        )}
          </button>

          </form>
          {/* EXTRA */}
          <p className="text-center text-xs text-gray-400 mt-6 bg-gray-50 py-2 rounded-lg">
            Demo: admin@gmail.com | password
          </p>

        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {

  const [name, setName] = useState("Shafreen Shahnaz");
  const [email, setEmail] = useState("shafreenshahnaz@gmail.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [dept, setDept] = useState("Computer Science");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    const data = JSON.parse(saved);
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setDept(data.dept);
  }
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // save theme
  localStorage.setItem("theme", theme);

}, [theme]);

const handleVerifyPassword = async () => {
  try {
    const res = await fetch("https://attendpro-backend.onrender.com/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        currentPassword,
        email
      })
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Password verified ✅");
      setIsVerified(true);
    } else {
      toast.error(data.message || "Incorrect password ❌");
      setIsVerified(false);
    }

  } catch (error) {
    console.error(error);
    toast.error("Server error ❌");
  }
};

  const [emailNotif, setEmailNotif] = useState(true);
  const [lowAttendance, setLowAttendance] = useState(true);
  const [dailyReport, setDailyReport] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const handleSave = async () => {
    if (newPassword && !isVerified) {
  toast.error("Please verify current password first ❌");
  return;
}
  const updatedUser = {
    name,
    email,
    phone,
    dept,
    currentPassword,
    newPassword,
    lowAttendance,
    emailNotif,
    dailyReport,
    weeklyReport
  };

  localStorage.setItem("userProfile", JSON.stringify(updatedUser));

  // 🔥 SEND TO BACKEND
 const res = await fetch("https://attendpro-backend.onrender.com/save-settings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  lowAttendance: lowAttendance,
  email: email,
  dailyReport: dailyReport,
  weeklyReport: weeklyReport
})
});

const data = await res.json();

if (res.ok) {
  toast.success("Settings saved successfully ✅");
} else {
  toast.error(data.message || "Error updating settings ❌");
}
};

  const handleLogout = () => {
    toast.success("Logged out 👋");
    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen animate-fade-in 
                dark:bg-slate-800 dark:text-gray-100">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-500 mb-8">
        Manage your account and preferences
      </p>

      {/* PROFILE */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 
                dark:bg-gray-800 dark:border dark:border-gray-700">

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="text-blue-600" size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Profile Information</h2>
            <p className="text-sm text-gray-500">Update your personal details</p>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm mb-1">Full Name</p>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-soft"
            />
          </div>

          <div>
            <p className="text-sm mb-1">Email</p>
            <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="input-soft"
/>
          </div>

          <div>
            <p className="text-sm mb-1">Phone</p>
            <input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="input-soft"
/>
          </div>

          <div>
            <p className="text-sm mb-1">Department</p>
            <input
  value={dept}
  onChange={(e) => setDept(e.target.value)}
  className="input-soft"
/>
          </div>

        </div>

      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Bell className="text-blue-600" size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500">Choose what alerts you receive</p>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="space-y-4">

          {/* ITEM */}
          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Toggle state={emailNotif} setState={setEmailNotif} />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium">Low Attendance Alerts</p>
              <p className="text-sm text-gray-500">Alert when below 75%</p>
            </div>
            <Toggle state={lowAttendance} setState={setLowAttendance} />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium">Daily Report</p>
              <p className="text-sm text-gray-500">Get a daily summary</p>
            </div>
            <Toggle state={dailyReport} setState={setDailyReport} />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-medium">Weekly Report</p>
              <p className="text-sm text-gray-500">Receive a weekly digest</p>
            </div>
            <Toggle state={weeklyReport} setState={setWeeklyReport} />
          </div>

        </div>

      </div>

      {/* SECURITY */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Shield className="text-blue-600" size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Security</h2>
            <p className="text-sm text-gray-500">Password and account security</p>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="grid grid-cols-2 gap-6">

          <div>
  <p className="text-sm mb-1">Current Password</p>

  <div className="flex gap-3">
    <input
      type="password"
      value={currentPassword}
      onChange={(e) => {
        setCurrentPassword(e.target.value);
        setIsVerified(false); // reset if user changes password
      }}
      className="input-soft w-full"
    />

    <button
  onClick={handleVerifyPassword}
  className={`
    px-4 py-2 rounded-lg border transition-all duration-200
    ${isVerified 
      ? "bg-green-600 text-white border-green-600 shadow-md"
      : "border-gray-300 text-gray-600 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-md"
    }
  `}
>
  {isVerified ? "Verified ✅" : "Verify"}
</button>
  </div>
</div>

          <div>
            <p className="text-sm mb-1">New Password</p>
            <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-soft"
            />
          </div>

        </div>

      </div>

      {/* APPEARANCE */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Palette className="text-blue-600" size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Appearance</h2>
            <p className="text-sm text-gray-500">Customize the look and feel</p>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="flex gap-4 justify-start">

  <button
    onClick={() => setTheme("light")}
    className={`px-5 py-2 rounded-xl border transition ${
      theme === "light"
        ? "border-blue-600 text-blue-600 shadow"
        : "border-gray-300 text-gray-500 hover:border-blue-400"
    }`}
  >
    Light
  </button>

  <button
    onClick={() => setTheme("system")}
    className={`px-5 py-2 rounded-xl border transition ${
      theme === "system"
        ? "border-blue-600 text-blue-600 shadow"
        : "border-gray-300 text-gray-500 hover:border-blue-400"
    }`}
  >
    System
  </button>

</div>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition"
        >
          Save Changes
        </button>

        <button
          onClick={handleLogout}
          className="border border-red-400 text-red-500 px-6 py-3 rounded-xl hover:bg-red-50 transition"
        >
          Sign Out
        </button>

      </div>

    </div>
  );
}

/* TOGGLE COMPONENT */
function Toggle({ state, setState }: any) {
  return (
    <button
      onClick={() => setState(!state)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        state ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
          state ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
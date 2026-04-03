import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Cell } from "recharts";

export default function StudentProfile() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  useEffect(() => {

    fetch(`https://attendpro-backend.onrender.com/student_profile/${id}`)
  .then(res => res.json())
  .then(data => {
    console.log("PROFILE:", data);
    setProfile(data);
  });

fetch(`https://attendpro-backend.onrender.com/student-weekly/${id}`)
  .then(res => res.json())
  .then(data => {
    console.log("WEEKLY:", data);
    setWeeklyData(data);
  });

  }, [id]);

  if (!profile) {
  return <DashboardLayout><div className="p-10">Loading...</div></DashboardLayout>;
}

  return (

    <DashboardLayout>

      <div className="pb-20 animate-fade-in">

        <button
  onClick={() => navigate("/students")}
  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
>
  ← Back to Students
</button>
        <h1 className="text-3xl font-bold mb-6">
          Student Profile
        </h1>

        {/* Student Info */}

        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">

          <p><b>Name:</b> {profile.name}</p>
          <p><b>Roll:</b> {profile.roll}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Department:</b> {profile.department}</p>

        </div>

        {/* Entry Attendance */}

        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">

           <div className="grid grid-cols-3 gap-4 mb-4">

  <div className="bg-blue-100 text-blue-700 p-4 rounded-xl text-center">
    <p className="text-sm">Total Days</p>
    <p className="text-xl font-bold">{profile.total_days}</p>
  </div>

  <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
    <p className="text-sm">Present</p>
    <p className="text-xl font-bold">{profile.present_days}</p>
  </div>

  <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center">
    <p className="text-sm">Absent</p>
    <p className="text-xl font-bold">{profile.absent_days}</p>
  </div>

</div>

          <h2 className="text-xl font-semibold mb-2">
            Entry Attendance
          </h2>

          <p className="text-2xl font-bold text-blue-600 mb-2">
            {profile?.entry_attendance ?? 0}%
          </p>

<span className={`px-3 py-1 rounded-full text-sm font-semibold ${
  profile.entry_attendance >= 75
    ? "bg-green-100 text-green-700"
    : profile.entry_attendance >= 50
    ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700"
}`}>
  {profile.entry_attendance >= 75
    ? "Excellent Attendance"
    : profile.entry_attendance >= 50
    ? "Average Attendance"
    : "Low Attendance"}
</span>

        </div>

        {/* Subject Attendance */}

        <div className="bg-white p-6 rounded-2xl shadow-md">

          <h2 className="text-xl font-semibold mb-4">
            Subject Attendance
          </h2>

          {profile.subjects.map((sub:any, index:number) => (

            <div
  key={index}
  className="border-b py-3"
>

  <div className="flex justify-between mb-1">
    <span>{sub.name}</span>

    <div className="flex items-center gap-3">

  <span className="text-blue-600 font-semibold">
    {sub.attendance}%
  </span>

  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
    sub.attendance >= 75
      ? "bg-green-100 text-green-700"
      : sub.attendance >= 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
  }`}>
    {sub.attendance >= 75
      ? "Good"
      : sub.attendance >= 50
      ? "Average"
      : "Low"}
  </span>

</div>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-3">

    <div
      className={`h-3 rounded-full ${
  sub.attendance >= 75
    ? "bg-green-500"
    : sub.attendance >= 50
    ? "bg-yellow-500"
    : "bg-red-500"
}`}
      style={{ width: `${sub.attendance}%` }}
    ></div>

  </div>

</div>

          ))}

        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mt-6">

  <h2 className="text-xl font-semibold mb-4">
    Weekly Attendance
  </h2>

  <div style={{ width: "100%", height: 300 }}>

    <ResponsiveContainer>

      <BarChart data={weeklyData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip
           contentStyle={{ borderRadius: "10px", border: "none" }}
        />

        <Bar
  dataKey="attendance"
  radius={[6, 6, 0, 0]}
  animationDuration={800}
>
  {
    weeklyData.map((entry, index) => (
      <Cell
  key={`cell-${index}`}
  fill={
    entry.name === today
      ? "#22c55e"   // 🟢 green = today
      : entry.attendance === 0
      ? "#d1d5db"   // ⚪ gray = absent
      : "#2563eb"   // 🔵 blue = normal
  }
/>
    ))
  }
</Bar>
      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

    </DashboardLayout>

  );
}
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BookOpen } from "lucide-react";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    attendance_percentage: 0
  });

  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {

    // Dashboard cards
    fetch("http://127.0.0.1:5000/dashboard")
      .then(res => res.json())
      .then(data => setStats(data));

    // Weekly attendance
    fetch("http://127.0.0.1:5000/weekly")
      .then(res => res.json())
      .then(data => setWeeklyData(data));

    // Attendance distribution
    fetch("http://127.0.0.1:5000/distribution")
      .then(res => res.json())
      .then(data => {

        setPieData([
          { name: "Present", value: data.present, color: "#22c55e" },
          { name: "Absent", value: data.absent, color: "#ef4444" },
          { name: "Late", value: data.late, color: "#f59e0b" }
        ]);

      });

    // Subject overview
    fetch("http://127.0.0.1:5000/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data));

  }, []);

  return (
    <DashboardLayout>
      <div className="pb-20 animate-fade-in">

        <div className="mb-10">

  <h1 className="text-3xl font-bold">
    Dashboard
  </h1>

  <p className="text-gray-500 dark:text-gray-300 mt-3">
    👋 Welcome back! Here's today's attendance overview.
  </p>

  <div className="mt-5 border-b border-gray-400"></div>

</div>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.04] border border-transparent hover:border-blue-600 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm opacity-90">Total Students</h2>
                <p className="text-3xl font-bold mt-2">{stats.total_students}</p>
                <p className="text-xs opacity-80 mt-1">Enrolled this semester</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">👥</div>
            </div>
          </div>

          <div className="bg-green-100 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.04] border border-transparent hover:border-green-500 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-green-700 text-sm">Present Today</h2>
                <p className="text-3xl font-bold mt-2 text-green-700">{stats.present_today}</p>
                <p className="text-xs text-green-700 mt-1">On time arrivals</p>
              </div>
              <div className="bg-green-200 p-3 rounded-xl">✔</div>
            </div>
          </div>

          <div className="bg-red-100 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.04] border border-transparent hover:border-red-400 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-red-600 text-sm">Absent Today</h2>
                <p className="text-3xl font-bold mt-2 text-red-600">{stats.absent_today}</p>
                <p className="text-xs text-red-600 mt-1">Need follow-up</p>
              </div>
              <div className="bg-red-200 p-3 rounded-xl">✖</div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.04] border border-transparent hover:border-gray-400 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm">Overall Attendance</h2>
                <p className="text-3xl font-bold mt-2">{stats.attendance_percentage}%</p>
                <p className="text-xs text-green-600 mt-1">Live data</p>
              </div>
              <div className="bg-gray-200 p-3 rounded-xl">📈</div>
            </div>
          </div>

        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Weekly Trend */}
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Weekly Attendance Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                <Bar dataKey="attendance" fill="#2563eb" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">
              Attendance Distribution
            </h2>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between text-sm dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Subjects Overview */}
        
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6">Subjects Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

            {subjects.map((subject) => {

  let barColor = "bg-red-500";

  if (subject.attendance >= 75) barColor = "bg-green-500";
  else if (subject.attendance >= 50) barColor = "bg-yellow-500";

  return (

    <div
      key={subject.code}
      className="bg-white dark:bg-slate-600 p-5 rounded-xl border shadow-sm
      hover:shadow-2xl hover:-translate-y-1
      transition-all duration-300 cursor-pointer"
    >

      <div className="flex items-center gap-3 mb-4">

        <div className="bg-blue-100 p-2 rounded-full">
          <BookOpen className="text-blue-600" size={18} />
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {subject.code}
          </p>

          <p className="font-semibold text-sm">
            {subject.name}
          </p>
        </div>

      </div>


      <div className="flex justify-between text-sm mb-2">

        <span className="text-gray-600 dark:text-gray-300">
          Attendance
        </span>

        <span className="font-semibold">
          {subject.attendance}%
        </span>

      </div>


      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
  <div
    className={`${barColor} h-2 rounded-full transition-all duration-700`}
    style={{ width: `${subject.attendance}%` }}
  ></div>
</div>

<div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mt-2">

  <span className="text-green-600 font-semibold">
    ✔ {subject.present}
  </span>

  <span className="text-red-600 font-semibold">
    ✖ {subject.absent}
  </span>

  <span className="text-yellow-600 font-semibold">
    ⏱ {subject.late}
  </span>

</div>

    </div>

  );

})}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
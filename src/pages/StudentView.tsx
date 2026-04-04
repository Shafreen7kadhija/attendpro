import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentView() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || user.role !== "student") {
    return <Navigate to="/" />;
}

  useEffect(() => {
    fetch(`https://attendpro-backend.onrender.com/student_profile/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(() => console.log("Error"));

    fetch(`https://attendpro-backend.onrender.com/student_profile/${id}`)
      .then(res => res.json())
      .then(data => setWeekly(data))
      .catch(() => console.log("Weekly error"));

    fetch(`https://attendpro-backend.onrender.com/student-records/${id}`)
    .then(res => res.json())
    .then(data => setRecords(data))
    .catch(() => console.log("Records error"));
  }, [id]);

  if (student === null) {
     return <p className="p-6">Loading...</p>;
    }

  const getStatus = (value: number) => {
    if (value >= 75) return { text: "Good", color: "bg-green-100 text-green-700" };
    if (value >= 50) return { text: "Average", color: "bg-yellow-100 text-yellow-700" };
    return { text: "Low", color: "bg-red-100 text-red-700" };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">Student Profile</h1>

      {/* STUDENT INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p><b>Name:</b> {student.name}</p>
        <p><b>Roll:</b> {student.roll}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Department:</b> {student.department}</p>
      </div>

      {/* ATTENDANCE CARDS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-blue-100 p-4 rounded-xl text-center">
            <p>Total Days</p>
            <h2 className="text-xl font-bold">{student.total_days}</h2>
          </div>

          <div className="flex-1 bg-green-100 p-4 rounded-xl text-center">
            <p>Present</p>
            <h2 className="text-xl font-bold">{student.present_days}</h2>
          </div>

          <div className="flex-1 bg-red-100 p-4 rounded-xl text-center">
            <p>Absent</p>
            <h2 className="text-xl font-bold">{student.absent_days}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">
            Entry Attendance: {student.entry_attendance}%
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              getStatus(student.entry_attendance).color
            }`}
          >
            {getStatus(student.entry_attendance).text}
          </span>
        </div>
      </div>

      {/* SUBJECT ATTENDANCE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Subject Attendance</h2>

        {student.subjects.map((sub: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-center">
              <span>{sub.name}</span>

              <div className="flex items-center gap-2">
                <span>{sub.attendance}%</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    getStatus(sub.attendance).color
                  }`}
                >
                  {getStatus(sub.attendance).text}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className={`h-2 rounded ${
                  sub.attendance >= 75
                    ? "bg-green-500"
                    : sub.attendance >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${sub.attendance}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* WEEKLY ATTENDANCE */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Attendance</h2>

        <div className="relative h-56 border-l border-b border-gray-300">

          {/* Y AXIS */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* GRID */}
          <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t border-dashed border-gray-300"></div>
            ))}
          </div>

          {/* BARS */}
          <div className="flex items-end justify-between h-full ml-10 pr-4">
            {weekly?.map((day, i) => (
              <div key={i} className="flex flex-col items-center flex-1">

                <div className="relative group flex flex-col items-center">

  {/* BACKGROUND BAR (only faint, not strong) */}
  <div className="absolute bottom-0 w-9 h-[200px] bg-gray-300 opacity-20 rounded-t"></div>

  {/* ACTUAL BAR */}
  <div
    className={`w-9 rounded-t transition-all duration-700 ease-out z-10
      ${
        day.attendance === 0
          ? "bg-transparent group-hover:bg-gray-400"
          : new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day.name
          ? "bg-green-500"
          : "bg-blue-600"
      }
    `}
    style={{
      height:
        day.attendance === 0
          ? "0px"
          : `${(day.attendance / 100) * 200}px`,
    }}
  ></div>

  {/* TOOLTIP */}
  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition bg-white text-xs px-3 py-2 rounded shadow z-20">
    <p className="font-semibold">{day.name}</p>
    <p>attendance : {day.attendance}</p>
  </div>

  {/* DAY LABEL */}
  <span className="text-xs mt-2">{day.name}</span>
</div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
import { Link } from "react-router-dom";
import {
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <div className="flex items-center gap-3">

  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 
                  rounded-xl flex items-center justify-center text-white text-lg shadow">
    🎓
  </div>

  <h1 className="text-xl font-bold text-gray-800">
    AttendPro
  </h1>

</div>

        <div className="flex gap-6 items-center">
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </div>


      {/* HERO SECTION */}
      <div className="text-center py-24 px-6">

        <div className="flex justify-center mb-6">

  <div className="flex items-center gap-2 px-4 py-2 border border-blue-200 
                  text-blue-600 rounded-full bg-blue-50">


<span className="text-lg">⚡</span>

<span className="text-sm font-medium">
  Modern Attendance Management
</span>


  </div>

</div>


        <h1 className="text-5xl font-bold mb-6">
          Simplify Attendance <br />
          <span className="text-blue-600">
            Management System
          </span>
        </h1>

        <p className="text-gray-600 mb-9">
          A comprehensive online attendance management system for colleges. Track, manage, and analyze student attendance with ease.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/mark-attendance"
            className="border px-6 py-3 rounded-lg"
          >
            Mark Attendance
          </Link>

        </div>

      </div>


      {/* FEATURES SECTION */}
      <div className="py-20 px-10 bg-white">

        <h2 className="text-3xl font-bold text-center mb-4">
          Powerful Features
        </h2>

        <p className="text-center text-gray-600 mb-12">
          Everything you need to manage attendance efficiently
        </p>
        <div className="grid grid-cols-4 gap-6">

  {/* Card 1 */}
  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition group">

    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
      <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600 group-hover:text-white"/>
    </div>

    <h3 className="font-semibold mb-2">
      Easy Attendance Marking
    </h3>

    <p className="text-gray-600">
      Mark attendance with just a few clicks. Simple and intuitive interface for teachers.
    </p>

  </div>

  {/* Card 2 */}
  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition group">

    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
      <ChartBarIcon className="w-6 h-6 text-blue-600 group-hover:text-white"/>
    </div>

    <h3 className="font-semibold mb-2">
      Real-time Analytics
    </h3>

    <p className="text-gray-600">
      Track attendance trends with beautiful charts and detailed statistics.
    </p>

  </div>

  {/* Card 3 */}
  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition group">

    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
      <UsersIcon className="w-6 h-6 text-blue-600 group-hover:text-white"/>
    </div>

    <h3 className="font-semibold mb-2">
      Student Management
    </h3>

    <p className="text-gray-600">
      Manage student records, profiles, and attendance history in one place.
    </p>

  </div>

  {/* Card 4 */}
  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition group">

    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
      <ShieldCheckIcon className="w-6 h-6 text-blue-600 group-hover:text-white"/>
    </div>

    <h3 className="font-semibold mb-2">
      Secure & Reliable
    </h3>

    <p className="text-gray-600">
      Your data is safe with enterprise-grade security and regular backups.
    </p>

  </div>

</div>

      </div>


      {/* WHY CHOOSE SECTION */}
      <div className="py-24 px-10 bg-gray-100">

        <div className="grid grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div>

            <h2 className="text-4xl font-bold mb-6">
              Why Choose AttendPro?
            </h2>

            <p className="text-gray-600 mb-8">
              Our system is designed specifically for educational institutions,
              making attendance management simple, accurate and efficient.
            </p>

            <div className="grid grid-cols-2 gap-4 text-gray-700">

              <p>✔ Reduce manual paperwork by 90%</p>
              <p>✔ Generate reports in seconds</p>
              <p>✔ Access from any device</p>
              <p>✔ Real-time attendance tracking</p>
              <p>✔ Automatic notifications</p>
              <p>✔ Easy data export</p>

            </div>

          </div>


          {/* RIGHT SIDE CARD */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-16 rounded-3xl text-center shadow-xl">

            <h1 className="text-6xl font-bold mb-4">
              95%
            </h1>

            <p className="text-xl">
              Time Saved
            </p>

            <p className="mt-4 text-blue-100">
              Compared to manual attendance tracking
            </p>

          </div>

        </div>

      </div>
      {/* CALL TO ACTION SECTION */}
<div className="py-24 px-10">

  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center p-16 rounded-3xl shadow-xl">

    <h2 className="text-4xl font-bold mb-4">
      Ready to Get Started?
    </h2>

    <p className="mb-8 text-blue-100">
      Start managing attendance efficiently today.
      Access the dashboard to view analytics and mark attendance.
    </p>

    <Link
      to="/dashboard"
      className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
    >
      Access Dashboard →
    </Link>

  </div>

</div>


{/* FOOTER */}
<div className="text-center py-8 text-gray-600 bg-white">

  <div className="flex justify-center items-center gap-3 mb-2">

  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 
                  rounded-lg flex items-center justify-center text-white">
    🎓
  </div>

  <h3 className="text-lg font-semibold text-gray-800">
    AttendPro
  </h3>

</div>

  <p>
    © 2026 AttendPro. Online Attendance Management System - Mini Project
  </p>

</div>
    </div>
  );
}
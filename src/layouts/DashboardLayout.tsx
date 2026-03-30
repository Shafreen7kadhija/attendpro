import { NavLink } from "react-router-dom";
import {
  Squares2X2Icon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col h-screen sticky top-0">

<div className="flex items-center gap-3 mb-8">

  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 
                  rounded-xl flex items-center justify-center text-white text-lg shadow">
    🎓
  </div>

  <div>
    <h1 className="text-lg font-bold text-gray-800">
      AttendPro
    </h1>

    <p className="text-xs text-gray-500">
      Management System
    </p>
  </div>

</div>
<hr className="border-gray-400 mb-6" />
        <nav className="flex flex-col gap-2 flex-1">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
           <div className="flex items-center gap-3">
  <Squares2X2Icon className="w-5 h-5 text-current" />
  Dashboard
</div>
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-3">
  <UsersIcon className="w-5 h-5 text-current" />
  Students
</div>
          </NavLink>

          <NavLink
            to="/mark-attendance"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-3">
  <ClipboardDocumentCheckIcon className="w-5 h-5 text-current" />
  Mark Attendance
</div>
          </NavLink>

          <NavLink
            to="/records"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            <div className="flex items-center gap-3">
  <DocumentTextIcon className="w-5 h-5 text-current" />
  Records
</div>
          </NavLink>

        </nav>
        <div className="mt-auto pt-6">
          <hr className="border-gray-400 my-6" />
  <NavLink
    to="/settings"
    className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg ${
    isActive
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-100"
  }`
}
  >
    <Cog6ToothIcon className="w-5 h-5 text-current" />
    Settings
  </NavLink>
</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}

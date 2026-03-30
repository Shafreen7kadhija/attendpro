import { Link, Outlet, useParams, useLocation } from "react-router-dom";

export default function StudentLayout() {
  const { id } = useParams();
  const location = useLocation();

  const menu = [
    { name: "Profile", path: `/student/profile/${id}` },
    { name: "Records", path: `/student/records/${id}` },
    { name: "Settings", path: `/student/settings/${id}` },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow p-4">
        <h1 className="text-xl font-bold mb-6">AttendPro</h1>

        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`p-3 rounded-lg ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
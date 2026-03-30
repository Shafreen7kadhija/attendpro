import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

const subjects = [
  "Data Structures",
  "Database Management",
  "Web Development",
  "Computer Networks",
  "Operating Systems",
];

const statuses = ["Present", "Absent", "Late"];

export default function Records() {

  const [recordsData, setRecordsData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [lastDeleted, setLastDeleted] = useState<any[]>([]);

  // Fetch records from backend
  useEffect(() => {

    fetch("http://127.0.0.1:5000/records")
      .then(res => res.json())
      .then(data => setRecordsData(data))
      .catch(err => console.error("Error fetching records:", err));

  }, []);

  const filteredRecords = recordsData.filter((record) => {
    return (
      (record.name.toLowerCase().includes(search.toLowerCase()) ||
        record.roll.toLowerCase().includes(search.toLowerCase())) &&
      (selectedSubject ? record.subject === selectedSubject : true) &&
      (selectedStatus ? record.status === selectedStatus : true)
    );
  });

  const exportCSV = () => {

  if (filteredRecords.length === 0) {
    toast.error("No records to export");
    return;
  }

  const header = "Name,Roll,Subject,Date,Time,Status\n";

  const dataToExport =
    selectedRows.length > 0
    ? selectedRows.map(i => filteredRecords[i])
    : filteredRecords;
    
  const rows = dataToExport
  .map((r) => {
    return `"${r.name}","${r.roll}","${r.subject}","${r.date}","${r.time}","${r.status}"`;
  })
  .join("\n");

  const blob = new Blob(["\uFEFF" + header + rows], {
    type: "text/csv;charset=utf-8;"
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance_records.csv";
  a.click();

  toast.success("Attendance exported successfully ✅");
};
const exportExcel = () => {

  const dataToExport =
    selectedRows.length > 0
      ? selectedRows.map(i => filteredRecords[i])
      : filteredRecords;

  if (dataToExport.length === 0) {
    toast.error("No records to export");
    return;
  }

  // ✅ Format data (clean headers)
  const formattedData = dataToExport.map((r) => ({
    Name: r.name,
    Roll: r.roll,
    Subject: r.subject,
    Date: r.date,
    Time: r.time,
    Status: r.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  XLSX.writeFile(workbook, "attendance_records.xlsx");

  toast.success("Excel exported successfully ✅");
};
  const handleDelete = async () => {

  if (selectedRows.length === 0) {
    toast.error("No records selected");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete?");
  if (!confirmDelete) return;

  const recordsToDelete = selectedRows.map(i => filteredRecords[i]);

  try {
    await fetch("http://127.0.0.1:5000/delete-records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recordsToDelete)
    });

    toast.success("Deleted successfully");

    setSelectedRows([]);

    // refresh data
    fetch("http://127.0.0.1:5000/records")
      .then(res => res.json())
      .then(data => setRecordsData(data));

  } catch (error) {
    toast.error("Delete failed");
  }
};
  return (

    <DashboardLayout>
      <div className="pb-20 animate-fade-in">

      <div className="flex justify-between items-center mb-8">

  <div>
  <h1 className="text-3xl font-bold">
    Attendance Records
  </h1>

  <p className="text-gray-500 mt-1">
    View and export attendance history
  </p>
</div>

  <div className="flex gap-3">

    <button
      onClick={exportExcel}
      className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition"
    >
      Export Excel
    </button>

    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:scale-105 transition"
    >
      Delete 
    </button>

  </div>

</div>

      {/* Filters */}

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex gap-4">

       <div className="relative flex-1">

<Search
  size={18}
  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
/>

<input
  type="text"
  placeholder="Search by student name or roll..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full border rounded-xl pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
{search && (
  <button
    onClick={() => setSearch("")}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
    ✕
  </button>
)}
</div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub}>{sub}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
  <th className="p-4">
    <input
      type="checkbox"
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedRows(filteredRecords.map((_, i) => i));
        } else {
          setSelectedRows([]);
        }
      }}
    />
  </th>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Roll</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {filteredRecords.length === 0 ? (

  <tr>
    <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
      No attendance records found
    </td>
  </tr>

) : (

  filteredRecords.map((record, index) => {

              const initials = record.name
                .split(" ")
                .map((n: string) => n[0])
                .join("");

              const statusColor =
                record.status === "Present"
                  ? "bg-green-100 text-green-700"
                  : record.status === "Absent"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";


              return (

                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-4">
  <input
    type="checkbox"
    checked={selectedRows.includes(index)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedRows([...selectedRows, index]);
      } else {
        setSelectedRows(selectedRows.filter(i => i !== index));
      }
    }}
  />
</td>
                  <td className="p-4 flex items-center gap-3">

                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                      {initials}
                    </div>

                    {record.name}

                  </td>

                  <td className="p-4 text-blue-600 font-medium">
                    {record.roll}
                  </td>

                  <td className="p-4">
                    {record.subject}
                  </td>

                  <td className="p-4">
  {record.date}
</td>

<td className="p-4 text-gray-600">
  {record.time}
</td>

<td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
                    >
                      {record.status}
                    </span>

                  </td>

                </tr>

              );

            })
)}

          </tbody>

        </table>

      </div>

</div>
    </DashboardLayout>

  );
}
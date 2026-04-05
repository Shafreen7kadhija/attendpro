import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";

export default function MarkAttendance() {

  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<{ [key: number]: string }>({});
  const [markAllClicked, setMarkAllClicked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [animatedCounts, setAnimatedCounts] = useState({
    present: 0,
    absent: 0,
    late: 0,
    unmarked: 0
  });

  const [date, setDate] = useState("");
  const [attendanceType, setAttendanceType] = useState("entry");
  const [subject, setSubject] = useState("CS201");

  const fetchStudents = async () => {
    try {
      const res = await fetch("https://attendpro-backend.onrender.com/students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {

    const present = Object.values(attendance).filter(v => v === "Present").length;
    const absent = Object.values(attendance).filter(v => v === "Absent").length;
    const late = Object.values(attendance).filter(v => v === "Late").length;
    const unmarked = students.length - Object.keys(attendance).length;

    const duration = 300;
    const steps = 10;
    const interval = duration / steps;

    let step = 0;

    const counter = setInterval(() => {

      step++;

      setAnimatedCounts({
        present: Math.round((present / steps) * step),
        absent: Math.round((absent / steps) * step),
        late: Math.round((late / steps) * step),
        unmarked: Math.round((unmarked / steps) * step)
      });

      if (step >= steps) {
        clearInterval(counter);
        setAnimatedCounts({ present, absent, late, unmarked });
      }

    }, interval);

    return () => clearInterval(counter);

  }, [attendance, students]);



  // ✅ FIXED FUNCTION
  const handleStatus = async (studentId: number, status: string) => {

    const rawDate = date || new Date().toISOString().split("T")[0];
    
    const attendanceDate = new Date(rawDate)
    .toLocaleDateString("en-GB")
    .split("/")
    .join("-");

    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));

    try {

      // Entry attendance (for dashboard)
if (attendanceType === "entry") 
  {
    await fetch("https://attendpro-backend.onrender.com/entry_attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      
    body: JSON.stringify({
      student_id: studentId,
      date: attendanceDate,
      status: status
    })
});

} else {

await fetch("https://attendpro-backend.onrender.com/attendance", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
student_id: studentId,
subject: subject,
date: attendanceDate,
status: status
})
});

}
    }
catch (error) {
      console.error("Attendance save error:", error);
    }

  };



  const markAllPresent = async () => {

  const allPresent: { [key: number]: string } = {};

  const rawDate = date || new Date().toISOString().split("T")[0];
  const attendanceDate = new Date(rawDate)
  .toLocaleDateString("en-GB")
  .split("/")
  .join("-");

  for (const student of students) {

    allPresent[student.id] = "Present";

    try {

      if (attendanceType === "entry") {

        await fetch("https://attendpro-backend.onrender.com/entry_attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            student_id: student.id,
            date: attendanceDate,
            status: "Present"
          })
        });

      } else {

        await fetch("https://attendpro-backend.onrender.com/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            student_id: student.id,
            subject: subject,
            date: attendanceDate,
            status: "Present"
          })
        });

      }

    } catch (error) {
      console.error("Attendance save error:", error);
    }

  }

  setAttendance(allPresent);

  setMarkAllClicked(true);

  setTimeout(() => {
    setMarkAllClicked(false);
  }, 800);

};



  const resetAttendance = () => {
    setAttendance({});
  };

const handleSaveAttendance = async () => {

  if (isSaving) return;

  setIsSaving(true);

  const totalStudents = students.length;
  const markedStudents = Object.keys(attendance).length;

  if (markedStudents !== totalStudents) {
    toast.error("Please mark attendance for all remaining students");
    setIsSaving(false);
    return;
  }

  try {

    const res = await fetch("https://attendpro-backend.onrender.com/trigger-low-attendance", {
      method: "POST"
    });

    const data = await res.json();   // 🔥 FIX

    console.log(data);  

    toast.success("Attendance saved successfully");

  } catch (error) {
    console.error("ERROR:", error);
    toast.error("Something went wrong");   // 🔥 add this
  }

  setIsSaving(false);
};

  const subjects: { [key: string]: string } = {
    CS201: "Data Structures",
    CS202: "Database Management",
    CS203: "Web Development",
    CS204: "Computer Networks",
    CS205: "Operating Systems"
  };



  const selectedDate = date ? new Date(date) : new Date();

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });



  return (

    <DashboardLayout>

      <div className="pb-20 animate-fade-in">

        <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
        <p className="text-gray-500 mb-6">
          Record daily attendance for students
        </p>



        {/* Controls */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 grid grid-cols-4 gap-6 items-end">

          {/* Attendance Type */}
<div className="flex flex-col">
<label className="text-sm text-gray-600 mb-1">Attendance Type</label>

<select
value={attendanceType}
onChange={(e) => setAttendanceType(e.target.value)}
className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

<option value="entry">Entry Attendance</option>
<option value="subject">Subject Attendance</option>

</select>

</div>


{/* Subject Dropdown Only for Subject Attendance */}

{attendanceType === "subject" && (

<div className="flex flex-col">

<label className="text-sm text-gray-600 mb-1">Subject</label>

<select
value={subject}
onChange={(e) => setSubject(e.target.value)}
className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>

<option value="CS201">CS201 - Data Structures</option>
<option value="CS202">CS202 - Database Management</option>
<option value="CS203">CS203 - Web Development</option>
<option value="CS204">CS204 - Computer Networks</option>
<option value="CS205">CS205 - Operating Systems</option>

</select>

</div>

)}



          <div className="flex flex-col">

            <label className="text-sm text-gray-600 mb-1">Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>



          <button
            onClick={markAllPresent}
            className={`w-full px-5 py-2 rounded-xl flex items-center justify-center gap-2
            transition-all duration-300
            ${
              markAllClicked
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          >
            ✓ Mark All Present
          </button>



          <button
            onClick={resetAttendance}
            className="w-full px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            transition flex items-center justify-center gap-2"
          >
            ↻ Reset
          </button>

        </div>



        {/* Stats */}

        <div className="grid grid-cols-4 gap-4 mb-6">

          <div className="bg-green-100 border border-green-200 hover:border-green-500 
rounded-xl p-4 text-center shadow-sm hover:shadow-2xl 
transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-green-700">
              {animatedCounts.present}
            </p>
            <p className="text-sm">Present</p>
          </div>

          <div className="bg-red-100 border border-red-200 hover:border-red-500 
rounded-xl p-4 text-center shadow-sm hover:shadow-2xl 
transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-red-700">
              {animatedCounts.absent}
            </p>
            <p className="text-sm">Absent</p>
          </div>

          <div className="bg-yellow-100 border border-yellow-200 hover:border-yellow-500 
rounded-xl p-4 text-center shadow-sm hover:shadow-2xl 
transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-yellow-700">
              {animatedCounts.late}
            </p>
            <p className="text-sm">Late</p>
          </div>

          <div className="bg-gray-100 border border-gray-200 hover:border-gray-500 
rounded-xl p-4 text-center shadow-sm hover:shadow-2xl 
transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-gray-700">
              {animatedCounts.unmarked}
            </p>
            <p className="text-sm">Unmarked</p>
          </div>

        </div>



        {/* Students */}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="px-6 py-5 border-b">

            <h2 className="text-xl font-semibold">
  {attendanceType === "entry"
    ? `Entry Attendance - ${formattedDate}`
    : `${subjects[subject]} - ${formattedDate}`}
</h2>

          </div>



          {students.map((student) => {

            const status = attendance[student.id];

            return (

              <div
                key={student.id}
                className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
              >

                <div>

                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-gray-500">
                    {student.register_number}
                  </p>

                </div>



                <div className="flex gap-2">

                  <button
                    onClick={() => handleStatus(student.id, "Present")}
                    className={`px-4 py-2 rounded-xl
                    ${
                      status === "Present"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    ✓ Present
                  </button>



                  <button
                    onClick={() => handleStatus(student.id, "Absent")}
                    className={`px-4 py-2 rounded-xl
                    ${
                      status === "Absent"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    ✕ Absent
                  </button>



                  <button
                    onClick={() => handleStatus(student.id, "Late")}
                    className={`px-4 py-2 rounded-xl
                    ${
                      status === "Late"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    ⏱ Late
                  </button>

                </div>

              </div>

            );

          })}

        </div>



        <div className="flex justify-end mt-6">

          <button
            onClick={handleSaveAttendance}
             disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
          >
            💾 Save Attendance
          </button>

        </div>

      </div>

    </DashboardLayout>

  );

}
import { useNavigate } from "react-router-dom";
import { Mail, GraduationCap, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import toast from "react-hot-toast";

export default function Students() {

  const [students, setStudents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filteredStudents = students.filter((student) => {
  const searchText = search.toLowerCase();

  return (
    student.name.toLowerCase().includes(searchText) ||
    student.register_number.toLowerCase().includes(searchText) ||
    student.email.toLowerCase().includes(searchText)
  );
});
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState(""); 
  const [department, setDepartment] = useState("");

  const [editStudent, setEditStudent] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editRegister, setEditRegister] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

  // fetch students
  const fetchStudents = async () => {
    const res = await fetch("http://127.0.0.1:5000/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // add student
  const addStudent = async () => {

    if (!name || !registerNumber || !email || !department) {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await fetch("http://127.0.0.1:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          register_number: registerNumber,
          email: email,
          department: department
        })
      });

      if (res.ok) {

        setName("");
        setRegisterNumber("");
        setEmail("");
        setDepartment("");

        fetchStudents();

      } else {
        alert("Failed to add student");
      }

    } catch (error) {
      console.error(error);
    }

  };

  // delete student
  const deleteStudent = async (id: number) => {

  try {

    const res = await fetch(`http://127.0.0.1:5000/students/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      fetchStudents();
      setDeleteStudentId(null);
      toast.success("Student deleted successfully");
    }

  } catch (error) {
    console.error(error);
  }

};

  // update student
  const updateStudent = async () => {

    try {

      const res = await fetch(`http://127.0.0.1:5000/students/${editStudent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editName,
          register_number: editRegister,
          email: editEmail,
          department: editDepartment
        })
      });

      if (res.ok) {

  toast.success("Student updated successfully");

  setEditStudent(null);
  fetchStudents();

}
      else {
        alert("Update failed");
      }

    } catch (error) {
      console.error(error);
    }

  };

  return (
  <DashboardLayout>
    <div className="pb-20 animate-fade-in">

      <div className="mb-8">

  <h1 className="text-3xl font-bold">Students</h1>

  <p className="text-gray-500 mt-3 mb-4">
    Manage student records and information
  </p>

  <div className="relative">

  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search by name, roll number, or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border rounded-xl pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {search && (
    <button
      onClick={() => setSearch("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
    >
      <X size={16} />
    </button>
  )}

</div>

</div>

      {/* Add Student Form */}

      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex gap-4">

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="text"
          placeholder="Register Number"
          value={registerNumber}
          onChange={(e) => setRegisterNumber(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <button
          type="button"
          onClick={addStudent}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Add
        </button>

      </div>

      {/* Student Cards */}

      <div className="grid grid-cols-3 gap-6">
        {filteredStudents.length === 0 && (
  <div className="col-span-3 text-center text-gray-500 py-10">
    No students found
  </div>
)}

     {filteredStudents.map((student) => {
          const initials = student.name
            .split(" ")
            .map((n: string) => n[0])
            .join("");

          return (

            <div
              key={student.id}
              onMouseEnter={() => setHoveredCard(student.id)}
              onMouseLeave={() => {
                setHoveredCard(null);
                setMenuOpen(null);
              }}
              className="relative bg-white p-6 rounded-2xl shadow-md hover:scale-[1.04] hover:shadow-2xl border border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer"
            >

              {hoveredCard === student.id && (
                <div className="absolute top-4 right-4">

                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === student.id ? null : student.id)
                    }
                    className="text-gray-500 hover:text-black text-xl"
                  >
                    ⋮
                  </button>

                  {menuOpen === student.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg border">

                      <button
                        onClick={() => {
                          setEditStudent(student);
                          setEditName(student.name);
                          setEditRegister(student.register_number);
                          setEditEmail(student.email);
                          setEditDepartment(student.department);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteStudentId(student.id)}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>

                    </div>
                  )}

                </div>
              )}

              <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-xl text-xl font-bold mb-4">
                {initials}
              </div>

              <h2 className="text-lg font-semibold">
                {student.name}
              </h2>

              <p className="text-blue-600 font-medium mt-1">
                {student.register_number}
              </p>

              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Mail size={16} />
                {student.email}
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <GraduationCap size={16} />
                {student.department}
              </div>

              <button
  onClick={() => navigate(`/student-profile/${student.id}`)}
  className="mt-4 w-full bg-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-300 py-2 rounded-xl"
>
  View Profile
</button>

            </div>

          );

        })}

      </div>

      {/* EDIT POPUP */}

      {editStudent && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-4">Edit Student</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="text"
              value={editRegister}
              onChange={(e) => setEditRegister(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="text"
              value={editDepartment}
              onChange={(e) => setEditDepartment(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />

           <div className="flex justify-end gap-3">

  <button
    onClick={() => setEditStudent(null)}
    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition"
  >
    Cancel
  </button>

  <button
    onClick={updateStudent}
    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition"
  >
    Save
  </button>

</div>

          </div>

        </div>

      )}

{deleteStudentId && (

<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">

  <div className="bg-white p-6 rounded-xl w-96">

    <h2 className="text-lg font-semibold mb-4">
      Are you sure you want to delete this student?
    </h2>

    <div className="flex justify-end gap-3">

      <button
        onClick={() => setDeleteStudentId(null)}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition"
      >
        Cancel
      </button>

      <button
        onClick={() => deleteStudent(deleteStudentId)}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition"
      >
        Delete
      </button>

    </div>

  </div>

</div>

)}
</div>
    </DashboardLayout>
  );
}
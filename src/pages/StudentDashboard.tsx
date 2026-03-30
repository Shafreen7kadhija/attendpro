import StudentProfile from "./StudentProfile";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudentDashboard() {

  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/student/${id}`)
      .then(res => res.json())
      .then(data => setStudent(data))
      .catch(() => console.log("Error loading student"));
  }, [id]);

  if (!student) {
    return <p className="p-6">Loading...</p>;
  }

 return <StudentProfile />;
}
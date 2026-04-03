import sqlite3
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'shafreenshahnaz@gmail.com'
app.config['MAIL_PASSWORD'] = 'wemt hasy jhgh oiji'
app.config['MAIL_USE_TLS'] = True

mail = Mail(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///attendpro.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
import threading

def send_email(to, subject, body):
    def send():
        with app.app_context():
            msg = Message(subject, sender=app.config['MAIL_USERNAME'], recipients=[to])
            msg.body = body
            mail.send(msg)

    threading.Thread(target=send).start()

# ================= STUDENT TABLE =================

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    register_number = db.Column(db.String(50))
    email = db.Column(db.String(120))   # NEW FIELD ADDED
    department = db.Column(db.String(100))


# ================= ATTENDANCE TABLE =================

class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    subject = db.Column(db.String(20))
    date = db.Column(db.String(20))
    status = db.Column(db.String(10))
    timestamp = db.Column(db.DateTime, default=datetime.now)

# ================= ENTRY ATTENDANCE TABLE =================

class EntryAttendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    date = db.Column(db.String(20))
    status = db.Column(db.String(10))
    timestamp = db.Column(db.DateTime, default=datetime.now)

# ================= USER TABLE =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# ================= HOME =================

@app.route("/")
def home():
    return {"message": "AttendPro Backend Running"}


# ================= GET STUDENTS =================

@app.route("/students", methods=["GET"])
def get_students():

    students = Student.query.all()

    data = []
    for s in students:
        data.append({
            "id": s.id,
            "name": s.name,
            "register_number": s.register_number,
            "email": s.email,
            "department": s.department
        })

    return jsonify(data)


# ================= ADD STUDENT =================

@app.route("/students", methods=["POST"])
def add_student():

    try:

        data = request.get_json()

        name = data.get("name")
        register_number = data.get("register_number")
        email = data.get("email") 
        department = data.get("department")

        new_student = Student(
            name=name,
            register_number=register_number,
            email=email, 
            department=department
        )

        db.session.add(new_student)
        db.session.commit()

        return jsonify({"message": "Student added successfully"})

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to add student"}), 500
    

# ================= DELETE STUDENT =================

@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):

    student = Student.query.get(id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({"message": "Student deleted successfully"})


# ================= UPDATE STUDENT =================

@app.route("/students/<int:id>", methods=["PUT"])
def update_student(id):

    student = Student.query.get(id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.json

    student.name = data.get("name")
    student.register_number = data.get("register_number")
    student.email = data.get("email")
    student.department = data.get("department")

    db.session.commit()

    return jsonify({"message": "Student updated successfully"})


# ================= MARK ATTENDANCE =================

@app.route("/attendance", methods=["POST"])
def mark_attendance():

    data = request.json

    student_id = data["student_id"]
    subject = data["subject"]
    date_val = data["date"]
    status = data["status"]

    existing = Attendance.query.filter_by(
        student_id=student_id,
        subject=subject,
        date=date_val
    ).first()

    if existing:
        existing.status = status
    else:
        attendance = Attendance(
            student_id=student_id,
            subject=subject,
            date=date_val,
            status=status
        )
        db.session.add(attendance)
    db.session.commit()

    return {"message": "Attendance saved"}


# ================= ENTRY ATTENDANCE =================

@app.route("/entry_attendance", methods=["POST"])
def entry_attendance():

    data = request.json

    student_id = data["student_id"]
    date_val = datetime.strptime(data["date"], "%Y-%m-%d").strftime("%d-%m-%Y")
    status = data["status"]

    existing = EntryAttendance.query.filter_by(
        student_id=student_id,
        date=date_val
    ).all()
    
    # 🔥 DELETE ALL OLD DUPLICATES
    for e in existing:
        db.session.delete(e)
        
    # 🔥 INSERT ONLY ONE CLEAN RECORD
    entry = EntryAttendance(
        student_id=student_id,
        date=date_val,
        status=status
    )
    db.session.add(entry)
    db.session.commit()
    return {"message": "Entry attendance saved"}

@app.route("/trigger-low-attendance", methods=["POST"])
def trigger_low_attendance():
    print("TRIGGER API CALLED ✅")

    # just call logic (ignore return)
    check_low_attendance()

    return {"message": "OK"}   # ✅ simple return (NO jsonify)

# ================= DASHBOARD =================

@app.route("/dashboard")
def dashboard():

    students = Student.query.all()
    total_students = len(students)

    today = date.today().strftime("%d-%m-%Y")
    records = EntryAttendance.query.filter_by(date=today).all()
    unique_records = {}
    for r in records:
        unique_records[r.student_id] = r.status.strip().lower()
    present_today = sum(
        1 for s in unique_records.values()
        if s in ["present", "late"]
    )
    absent_today = sum(
        1 for s in unique_records.values()
        if s == "absent"
    )

    attendance_percentage = 0
    if total_students > 0:
        attendance_percentage = round((present_today / total_students) * 100)
        
    return jsonify({
        "total_students": total_students,
        "present_today": present_today,
        "absent_today": absent_today,
        "attendance_percentage": attendance_percentage
    })

# ================= WEEKLY ATTENDANCE =================

@app.route("/weekly")
def weekly():

    today = datetime.today()
    result = []
    total_students = Student.query.count()

    for i in range(7):

        day = today - timedelta(days=6 - i)

        day_str = day.strftime("%d-%m-%Y")
        day_name = day.strftime("%a")

        records = EntryAttendance.query.filter_by(date=day_str).all()

        present_students = set()

        for r in records:
            if r.status.strip().lower() in ["present", "late"]:
                present_students.add(r.student_id)

        present_count = len(present_students)

        percentage = 0
        if total_students > 0:
            percentage = round((present_count / total_students) * 100)

        result.append({
            "name": day_name,
            "attendance": percentage
        })

    return jsonify(result)

# ================= EMAIL ALERT =================
@app.route("/check-low-attendance")
def check_low_attendance():
    print("CHECK LOW ATTENDANCE RUNNING")
    print("LOW ATTENDANCE CHECK ALWAYS ENABLED ✅")
    
    students = Student.query.all()
     # 🔥 OVERALL CLASS ATTENDANCE
    today = datetime.today().strftime("%d-%m-%Y")
    records_today = EntryAttendance.query.filter_by(date=today).all()
    unique_today = {}
    for r in records_today:
        unique_today[r.student_id] = r.status
    total_students = Student.query.count()
    present_today = sum(
        1 for s in unique_today.values()
          if s.strip().lower() in ["present", "late"]
     )
    overall_percentage = 0
    if total_students > 0:
            overall_percentage = (present_today / total_students) * 100
    low_list = []
    for s in students:
        records = EntryAttendance.query.filter_by(student_id=s.id).all()
        unique_dates = set(r.date for r in records)
        total = len(unique_dates)
        
        present_dates = set(
            r.date for r in records
            if r.status.strip().lower() in ["present", "late"]
        )
        
        present = len(present_dates)
        
        percentage = 0
        if total > 0:
            percentage = (present / total) * 100
            
        if percentage < 75:
            low_list.append(f"{s.name} ({round(percentage)}%)")
    # ✅ OUTSIDE LOOP
    print("OVERALL %:", overall_percentage)
    print("LOW LIST:", low_list)
    if low_list or overall_percentage < 75:
        print("CONDITION TRUE → SENDING EMAIL")
        
        body = f"⚠ LOW ATTENDANCE ALERT\n\n"
        
        if overall_percentage < 75:
            body += f"📊 Overall Attendance: {round(overall_percentage)}%\n\n"
            
        if low_list:
            body += "👤 Students below 75%:\n"
            body += "\n".join(low_list)
        
        admin_email = "shafreenshahnaz@gmail.com"
        send_email(
            admin_email,
            "Low Attendance Alert",
            body
        )
        print("LOW ATTENDANCE EMAIL SENT ✅")
            
        return {"message": "Checked"}

# ================= ATTENDANCE DISTRIBUTION =================

@app.route("/distribution")
def distribution():

    today = date.today().strftime("%d-%m-%Y")
    records = EntryAttendance.query.filter_by(date=today).all()

    unique_records = {}
    for r in records:
        unique_records[r.student_id] = r.status.strip().lower()
    present = sum(1 for s in unique_records.values() if s == "present")
    absent = sum(1 for s in unique_records.values() if s == "absent")
    late = sum(1 for s in unique_records.values() if s == "late")

    return jsonify({
        "present": present,
        "absent": absent,
        "late": late
    })


# ================= SUBJECT OVERVIEW =================

@app.route("/subjects")
def subjects():

    subjects = [
        {"code": "CS201", "name": "Data Structures"},
        {"code": "CS202", "name": "Database Management"},
        {"code": "CS203", "name": "Web Development"},
        {"code": "CS204", "name": "Computer Networks"},
        {"code": "CS205", "name": "Operating Systems"}
    ]

    result = []

    for sub in subjects:

        today = str(date.today())
        
        present = Attendance.query.filter(
            Attendance.subject == sub["code"],
            Attendance.date == today,
            Attendance.status == "Present"
        ).count()
        
        late = Attendance.query.filter(
            Attendance.subject == sub["code"],
            Attendance.date == today,
            Attendance.status == "Late"
        ).count()
        
        absent = Attendance.query.filter(
            Attendance.subject == sub["code"],
            Attendance.date == today,
            Attendance.status == "Absent"
        ).count()
        
        total_records = present + late + absent
        
        percentage = 0
        if total_records > 0:
            percentage = round(((present + late) / total_records) * 100)
            
        result.append({
            "code": sub["code"],
            "name": sub["name"],
            "attendance": percentage,
            "present": present,
            "absent": absent,
            "late": late
        })
    return jsonify(result)
    
@app.route("/records")
def get_records():

    subject_names = {
        "CS201": "Data Structures",
        "CS202": "Database Management",
        "CS203": "Web Development",
        "CS204": "Computer Networks",
        "CS205": "Operating Systems"
    }

    data = []

    # -------- SUBJECT ATTENDANCE --------

    subject_records = db.session.query(
        Student.name,
        Student.register_number,
        Attendance.subject,
        Attendance.date,
        Attendance.status,
        Attendance.timestamp
    ).join(Student, Student.id == Attendance.student_id).all()

    for r in subject_records:

        data.append({
            "name": r.name,
            "roll": r.register_number,
            "subject": subject_names.get(r.subject, r.subject),
            "date": r.date,
            "status": r.status,
            "time": r.timestamp.strftime("%I:%M %p")
        })


    # -------- ENTRY ATTENDANCE --------

    entry_records = db.session.query(
        Student.name,
        Student.register_number,
        EntryAttendance.date,
        EntryAttendance.status,
        EntryAttendance.timestamp
    ).join(Student, Student.id == EntryAttendance.student_id).all()

    for r in entry_records:

        data.append({
            "name": r.name,
            "roll": r.register_number,
            "subject": "Entry Attendance",
            "date": r.date,
            "status": r.status,
            "time": r.timestamp.strftime("%I:%M %p")
        })

    return jsonify(data)

@app.route("/entry_records")
def entry_records():

    records = EntryAttendance.query.all()

    data = []

    for r in records:
        data.append({
            "student_id": r.student_id,
            "date": r.date,
            "status": r.status
        })

    return jsonify(data)

# ================= STUDENT PROFILE =================

@app.route("/student_profile/<int:student_id>")
def student_profile(student_id):

    student = Student.query.get(student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    # -------- ENTRY ATTENDANCE --------
    # 🔥 ALL attendance days in system
    all_records = EntryAttendance.query.all()
    all_dates = set(str(r.date) for r in all_records)
    entry_total_days = len(all_dates)
    # 🔥 THIS student's records
    records = EntryAttendance.query.filter_by(student_id=student_id).all()
    
    present_days = set(
        r.date for r in records if r.status in ["Present", "Late"]
    )

    entry_present_count = len(present_days)
    entry_absent_count = entry_total_days - entry_present_count
    entry_percentage = 0
    if entry_total_days > 0:
        entry_percentage = round((entry_present_count / entry_total_days) * 100)


    # -------- SUBJECT ATTENDANCE --------
    subjects = {
        "CS201": "Data Structures",
        "CS202": "Database Management",
        "CS203": "Web Development",
        "CS204": "Computer Networks",
        "CS205": "Operating Systems"
    }

    subject_data = []

    for code, name in subjects.items():

        sub_records = Attendance.query.filter_by(
            student_id=student_id,
            subject=code
        ).all()

        unique_dates = set(r.date for r in sub_records)
        total_days = len(unique_dates)

        present_days = set(
            r.date for r in sub_records if r.status in ["Present", "Late"]
        )

        present_count = len(present_days)

        percentage = 0
        if total_days > 0:
            percentage = round((present_count / total_days) * 100)

        subject_data.append({
            "name": name,
            "attendance": percentage
        })

    # ✅ RETURN MUST BE OUTSIDE LOOP
    return jsonify({
        "name": student.name,
        "roll": student.register_number,
        "email": student.email,
        "department": student.department,
        "entry_attendance": entry_percentage,
        "total_days": entry_total_days,
        "present_days": entry_present_count,
        "absent_days": entry_absent_count,
        "subjects": subject_data
    })

@app.route("/student-weekly/<int:student_id>")
def student_weekly(student_id):

    today = datetime.today()
    result = []

    for i in range(7):
        day = today - timedelta(days=6 - i)

        day_str = day.strftime("%d-%m-%Y")   # ✅ FIXED
        day_name = day.strftime("%a")

        records = EntryAttendance.query.filter_by(
            student_id=student_id,   # ✅ IMPORTANT
            date=day_str
        ).all()

        present = 0

        for r in records:
            if r.status.strip().lower() in ["present", "late"]:
                present = 1   # per day (0 or 1)

        percentage = 100 if present else 0

        result.append({
            "name": day_name,
            "attendance": percentage
        })

    return jsonify(result)


    # -------- ENTRY ATTENDANCE --------

    entry_records = EntryAttendance.query.filter_by(student_id=student_id).all()

    present = sum(1 for r in entry_records if r.status in ["Present", "Late"])
    total = len(entry_records)

    entry_percentage = 0
    if total > 0:
        entry_percentage = round((present / total) * 100)


    # -------- SUBJECT ATTENDANCE --------

    subjects = {
        "CS201": "Data Structures",
        "CS202": "Database Management",
        "CS203": "Web Development",
        "CS204": "Computer Networks",
        "CS205": "Operating Systems"
    }

    subject_result = []

    for code, name in subjects.items():

        records = Attendance.query.filter_by(
            student_id=student_id,
            subject=code
        ).all()

        present = sum(1 for r in records if r.status in ["Present", "Late"])
        total = len(records)

        percentage = 0
        if total > 0:
            percentage = round((present / total) * 100)

        subject_result.append({
            "name": name,
            "attendance": percentage
        })


    return jsonify({
        "name": student.name,
        "roll": student.register_number,
        "email": student.email,
        "department": student.department,
        "entry_percentage": entry_percentage,
        "subjects": subject_result
    })

# ================= LOGIN =================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # ================= STUDENT LOGIN =================
    student = Student.query.filter_by(email=email).first()

    if student and password == "bitsathy":
        return jsonify({
            "role": "student",
            "id": student.id,
            "name": student.name
        })

    # ================= STAFF LOGIN (YOUR EXISTING CODE) =================
    user = User.query.filter_by(email=email).first()

    print("Entered:", email, password)
    print("DB User:", user.email if user else "No user")
    print("Stored Hash:", user.password if user else "No password")

    if user and user.password == password:
        return jsonify({
            "role": "staff",
            "message": "Login successful",
            "user_id": user.id
        })

    else:
        return jsonify({"message": "Invalid credentials"}), 401
    

@app.route("/test_login")
def test_login():
    user = User.query.filter_by(email="admin@gmail.com").first()

    if user:
        return {"message": "User exists"}
    else:
        return {"message": "User NOT found"}

user_settings = {}   # temporary storage

@app.route("/save-settings", methods=["POST"])
def save_settings():
    global user_settings
    user_settings = request.json

    print("SETTINGS RECEIVED:", user_settings)

    email = user_settings.get("email")
    new_password = user_settings.get("newPassword")

    # 🔥 GET USER (for now assume single user)
    user = User.query.first()

    if user:
        # ✅ UPDATE EMAIL
        user.email = email

        # ✅ UPDATE PASSWORD (if entered)
        if new_password:
            user.password = generate_password_hash(new_password)

        db.session.commit()

    # 🔥 KEEP YOUR EXISTING LOGIC
    if user_settings.get("dailyReport"):
        send_daily_report()

    if user_settings.get("weeklyReport"):
        send_weekly_report()

    return jsonify({"message": "Settings saved"})

@app.route("/send-daily-report")
def send_daily_report():

    if not user_settings.get("dailyReport"):
        return {"message": "Daily report disabled"}

    today = date.today().strftime("%d-%m-%Y")

    records = db.session.query(
        Student.name,
        EntryAttendance.status
    ).join(Student, Student.id == EntryAttendance.student_id)\
     .filter(EntryAttendance.date == today).all()

    present = [r.name for r in records if r.status.lower() in ["present", "late"]]
    absent = [r.name for r in records if r.status.lower() == "absent"]
    late = [r.name for r in records if r.status.lower() == "late"]

    body = f"""
📅 DAILY ATTENDANCE REPORT

Date: {today}

✅ Present ({len(present)}):
{chr(10).join(present) if present else "None"}

❌ Absent ({len(absent)}):
{chr(10).join(absent) if absent else "None"}

⏰ Late ({len(late)}):
{chr(10).join(late) if late else "None"}
"""

    send_email(user_settings.get("email"), "Daily Report", body)

    return {"message": "Daily report sent"}

@app.route("/send-weekly-report")
def send_weekly_report():

    if not user_settings.get("weeklyReport"):
        return {"message": "Weekly report disabled"}

    body = "📊 WEEKLY ATTENDANCE REPORT\n\n"

    for i in range(7):
        day = datetime.today() - timedelta(days=i)
        day_str = day.strftime("%d-%m-%Y")

        records = db.session.query(
            Student.name,
            EntryAttendance.status
        ).join(Student, Student.id == EntryAttendance.student_id)\
         .filter(EntryAttendance.date == day_str).all()

        present = [r.name for r in records if r.status == "Present"]
        absent = [r.name for r in records if r.status == "Absent"]
        late = [r.name for r in records if r.status == "Late"]

        body += f"""
📅 {day_str}

✅ Present ({len(present)}):
{chr(10).join(present) if present else "None"}

❌ Absent ({len(absent)}):
{chr(10).join(absent) if absent else "None"}

⏰ Late ({len(late)}):
{chr(10).join(late) if late else "None"}

----------------------------
"""

    send_email(user_settings.get("email"), "Weekly Report", body)

    return {"message": "Weekly report sent"}

@app.route("/verify-password", methods=["POST"])
def verify_password():

    data = request.json
    current_password = data.get("currentPassword")
    email = data.get("email")   # 🔥 get email

    user = User.query.filter_by(email=email).first()   # 🔥 FIX

    if user and check_password_hash(user.password, current_password):
        return jsonify({"message": "Password correct"})
    else:
        return jsonify({"message": "Incorrect password"}), 400
    
@app.route("/delete-records", methods=["POST"])
def delete_records():

    data = request.json

    for record in data:

        name = record.get("name")
        roll = record.get("roll")
        subject = record.get("subject")
        date = record.get("date")

        student = Student.query.filter_by(register_number=roll).first()

        if not student:
            continue

        # 🔥 ENTRY ATTENDANCE
        if subject == "Entry Attendance":
            EntryAttendance.query.filter_by(
                student_id=student.id,
                date=date
            ).delete()

        # 🔥 SUBJECT ATTENDANCE
        else:
            subject_map = {
                "Data Structures": "CS201",
                "Database Management": "CS202",
                "Web Development": "CS203",
                "Computer Networks": "CS204",
                "Operating Systems": "CS205"
            }

            subject_code = subject_map.get(subject)

            Attendance.query.filter_by(
                student_id=student.id,
                subject=subject_code,
                date=date
            ).delete()

    db.session.commit()

    return {"message": "Deleted successfully"}

# temporary in-memory settings
user_settings = {
    "low_attendance": True,
    "daily_report": True,
    "weekly_report": True,
    "email": "shafreenshahnaz@gmail.com"
}

@app.route("/settings", methods=["GET"])
def get_settings():
    return jsonify(user_settings)

@app.route("/student-records/<int:student_id>")
def student_records(student_id):
    conn = sqlite3.connect("attendance.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT subject, date, time, status
        FROM records
        WHERE student_id = ?
        ORDER BY date DESC
    """, (student_id,))

    data = [dict(row) for row in cur.fetchall()]
    conn.close()

    return jsonify(data)

# ================= RUN =================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

        # ✅ Create default login user (only once)
        if not User.query.filter_by(email="admin@gmail.com").first():
            default_user = User(
                email="admin@gmail.com",
                password="admin123"
            )
            db.session.add(default_user)
            db.session.commit()

if __name__ == "__main__":
    import os
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 10000)),
        debug=False
    )
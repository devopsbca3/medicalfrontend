import { useEffect, useState } from "react";

function App() {
  const emptyForm = {
    record_id: "",
    patient_name: "",
    age: "",
    gender: "",
    contact_number: "",
    doctor_name: "",
    diagnosis: "",
    visit_date: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [records, setRecords] = useState([]);

  // 🔹 Load records
  const loadRecords = async () => {
    try {
      const res = await fetch("https://medicalbackend-dg6o.onrender.com//8080/records");
      const data = await res.json();
      const mapped = data.map((r) => ({
        record_id: r.id,
        patient_name: r.patientName || "",
        age: r.age || "",
        gender: r.gender || "",
        contact_number: r.contactNumber || "",
        doctor_name: r.doctorName || "",
        diagnosis: r.diagnosis || "",
        visit_date: r.visitDate || "",
      }));
      setRecords(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveRecord = async () => {
    if (!form.patient_name) return alert("Patient Name required");

    const payload = {
      patientName: form.patient_name,
      age: form.age,
      gender: form.gender,
      contactNumber: form.contact_number,
      doctorName: form.doctor_name,
      diagnosis: form.diagnosis,
      visitDate: form.visit_date,
    };

    try {
      if (form.record_id) {
        await fetch(`http://localhost:8080/records/${form.record_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:8080/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setForm(emptyForm);
      loadRecords();
    } catch (err) { console.error(err); }
  };

  const editRecord = (r) => setForm(r);

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await fetch(`http://localhost:8080/records/${id}`, { method: "DELETE" });
      loadRecords();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.body}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Medical Record Management</h2>

        {/* Form */}
        <div style={styles.grid}>
          <input name="patient_name" placeholder="Patient Name" value={form.patient_name} onChange={handleChange}/>
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange}/>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={handleChange}/>
          <input name="doctor_name" placeholder="Doctor Name" value={form.doctor_name} onChange={handleChange}/>
          <input name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange}/>
          <input name="visit_date" type="date" value={form.visit_date} onChange={handleChange}/>
          <button onClick={saveRecord} style={styles.button}>
            {form.record_id ? "Update Record" : "Save Record"}
          </button>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Patient</th><th>Age</th><th>Gender</th>
              <th>Contact</th><th>Doctor</th><th>Diagnosis</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.record_id}>
                <td>{r.record_id}</td><td>{r.patient_name}</td><td>{r.age}</td><td>{r.gender}</td>
                <td>{r.contact_number}</td><td>{r.doctor_name}</td><td>{r.diagnosis}</td><td>{r.visit_date}</td>
                <td>
                  <button onClick={() => editRecord(r)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => deleteRecord(r.record_id)} style={styles.delBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

// 🔹 Styles
const styles = {
  body: { fontFamily:"Arial", background:"#f2f2f2", minHeight:"100vh", padding:"20px" },
  box: { background:"white", padding:"20px", maxWidth:"900px", margin:"auto", borderRadius:"8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  heading: { textAlign: "center", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginBottom: "20px"
  },
  button: { gridColumn: "1 / -1", padding:"10px", background:"#007bff", color:"white", border:"none", borderRadius:"4px", cursor:"pointer", fontWeight:"bold" },
  table: { width:"100%", borderCollapse:"collapse", fontSize:"14px" },
  editBtn: { background:"#28a745", color:"white", border:"none", padding:"5px 10px", marginRight:"5px", cursor:"pointer", borderRadius:"4px" },
  delBtn: { background:"#dc3545", color:"white", border:"none", padding:"5px 10px", cursor:"pointer", borderRadius:"4px" },
  th: { border:"1px solid #ddd", padding:"8px", background:"#f8f8f8", textAlign:"left" },
  td: { border:"1px solid #ddd", padding:"8px" }
};

export default App;

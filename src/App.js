import React, { useState, useEffect } from "react";

export default function App() {
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

  const doctors = ["Dr. John", "Dr. Priya", "Dr. Kumar"];

  const [form, setForm] = useState(emptyForm);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("medicalRecords");
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveRecord = () => {
    if (!form.patient_name.trim()) {
      alert("Patient Name is required!");
      return;
    }

    if (!form.doctor_name) {
      alert("Please select a doctor!");
      return;
    }

    const newRecord = {
      record_id: form.record_id || Date.now().toString(),
      patient_name: form.patient_name,
      age: form.age,
      gender: form.gender,
      contact_number: form.contact_number,
      doctor_name: form.doctor_name,
      diagnosis: form.diagnosis,
      visit_date: form.visit_date,
    };

    let updatedRecords;

    if (form.record_id) {
      updatedRecords = records.map((r) =>
        r.record_id === form.record_id ? newRecord : r
      );
    } else {
      updatedRecords = [...records, newRecord];
    }

    localStorage.setItem("medicalRecords", JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
    setForm(emptyForm);

    alert(form.record_id ? "Record Updated ✅" : "Record Added ✅");
  };

  const editRecord = (r) => {
    setForm(r);
  };

  const deleteRecord = (id) => {
    if (!window.confirm("Delete this record?")) return;

    const filtered = records.filter((r) => r.record_id !== id);
    localStorage.setItem("medicalRecords", JSON.stringify(filtered));
    setRecords(filtered);
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Medical Record Management</h2>

        {/* FORM */}
        <div style={styles.form}>
          <input
            style={styles.input}
            name="patient_name"
            placeholder="Patient Name"
            value={form.patient_name}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            style={styles.input}
            name="contact_number"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
          />

          {/* 🔥 DOCTOR DROPDOWN */}
          <select
            style={styles.input}
            name="doctor_name"
            value={form.doctor_name}
            onChange={handleChange}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>

          <input
            style={styles.input}
            name="diagnosis"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="visit_date"
            type="date"
            value={form.visit_date}
            onChange={handleChange}
          />

          <button style={styles.button} onClick={saveRecord}>
            {form.record_id ? "Update Record" : "Save Record"}
          </button>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.record_id}>
                <td>{r.record_id}</td>
                <td>{r.patient_name}</td>
                <td>{r.age}</td>
                <td>{r.gender}</td>
                <td>{r.doctor_name}</td>
                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => editRecord(r)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteRecord(r.record_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  body: {
    background: "#f0f2f5",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial",
  },
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "900px",
    margin: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    gridColumn: "1 / -1",
    padding: "12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
import { useEffect, useState } from "react";

// For production (Azure) use localStorage - no backend needed
// For local development with backend use: "http://localhost:8080/records"
const USE_LOCALSTORAGE = true;
const API = "http://localhost:8080/records";

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
  const [loading, setLoading] = useState(false);

  // ✅ Load Records from localStorage or API
  const loadRecords = async () => {
    try {
      if (USE_LOCALSTORAGE) {
        // Load from localStorage
        const saved = localStorage.getItem("medicalRecords");
        if (saved) {
          const parsed = JSON.parse(saved);
          setRecords(parsed);
          console.log("✅ Loaded from localStorage:", parsed);
        }
      } else {
        // Load from backend API
        const res = await fetch(API);

        if (!res.ok) throw new Error("Failed to fetch records");

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
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // Fallback to empty records
      setRecords([]);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Save or Update Record - SIMPLIFIED
  const saveRecord = () => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔵 SAVE BUTTON CLICKED");
    console.log("Form:", form);

    // Validate
    if (!form.patient_name || form.patient_name.trim() === "") {
      console.warn("❌ Patient name is empty");
      alert("❌ Patient Name is required!");
      return;
    }

    console.log("✅ Validation passed");

    // Create record
    const record = {
      record_id: form.record_id || `${Date.now()}`,
      patient_name: form.patient_name.trim(),
      age: form.age || "",
      gender: form.gender || "",
      contact_number: form.contact_number || "",
      doctor_name: form.doctor_name || "",
      diagnosis: form.diagnosis || "",
      visit_date: form.visit_date || "",
    };

    console.log("📝 Record object:", record);

    try {
      // 1. Get existing records from localStorage
      const existing = localStorage.getItem("medicalRecords");
      console.log("📦 Existing localStorage data:", existing);

      let allRecords = existing ? JSON.parse(existing) : [];
      console.log("📦 Parsed records:", allRecords);

      // 2. Add or update
      if (form.record_id) {
        // Update existing record
        allRecords = allRecords.map((r) =>
          r.record_id === form.record_id ? record : r
        );
        console.log("✏️  Updated existing record");
      } else {
        // Add new record
        allRecords.push(record);
        console.log("✨ Added new record");
      }

      // 3. Save to localStorage
      const jsonString = JSON.stringify(allRecords);
      localStorage.setItem("medicalRecords", jsonString);
      console.log("💾 Saved to localStorage");
      console.log("📦 Final saved data:", jsonString);

      // 4. Update React state
      setRecords(allRecords);
      console.log("🔄 Updated React state with records:", allRecords);

      // 5. Clear form
      setForm(emptyForm);
      console.log("🧹 Form cleared");

      // 6. Show success
      const message = form.record_id ? "Record Updated ✅" : "Record Added ✅";
      console.log("✅ " + message);
      alert(message);

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
      console.error("❌ ERROR:", error);
      alert("❌ Error: " + error.message);
    }
  };

  const editRecord = (r) => setForm(r);

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      if (USE_LOCALSTORAGE) {
        // Delete from localStorage
        const filtered = records.filter((r) => r.record_id !== id);
        localStorage.setItem("medicalRecords", JSON.stringify(filtered));
        setRecords(filtered);
        alert("Record Deleted ✅");
      } else {
        // Delete from backend API
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (!res.ok) throw new Error("Delete failed");

        alert("Record Deleted ✅");
        await loadRecords();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Medical Record Management</h2>

        {/* FORM */}
        <div style={styles.grid}>
          <input
            name="patient_name"
            placeholder="Patient Name"
            value={form.patient_name}
            onChange={handleChange}
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            name="contact_number"
            placeholder="Contact Number"
            value={form.contact_number}
            onChange={handleChange}
          />
          <input
            name="doctor_name"
            placeholder="Doctor Name"
            value={form.doctor_name}
            onChange={handleChange}
          />
          <input
            name="diagnosis"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
          />
          <input
            name="visit_date"
            type="date"
            value={form.visit_date}
            onChange={handleChange}
          />

          <button
            onClick={saveRecord}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Saving..."
              : form.record_id
              ? "Update Record"
              : "Save Record"}
          </button>
        </div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Date</th>
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
                <td>{r.contact_number}</td>
                <td>{r.doctor_name}</td>
                <td>{r.diagnosis}</td>
                <td>{r.visit_date}</td>
                <td>
                  <button
                    onClick={() => editRecord(r)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRecord(r.record_id)}
                    style={styles.delBtn}
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

// ✅ Styles
const styles = {
  body: {
    fontFamily: "Arial",
    background: "#f2f2f2",
    minHeight: "100vh",
    padding: "20px",
  },
  box: {
    background: "white",
    padding: "20px",
    maxWidth: "950px",
    margin: "auto",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    gridColumn: "1 / -1",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  editBtn: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  delBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default App;
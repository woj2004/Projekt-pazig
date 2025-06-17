import React, { useState } from "react";
import { auth, db } from "./Firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

function AddVisit({ patientId, onClose, onReady}){

    const [date, setDate] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [note, setNote] = useState("");
    
      const handleAddVisit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
          toast.error("Musisz być zalogowany!", { position: "top-center" });
          return;
        }
    
        try {
          await addDoc(collection(db, "Users", user.uid, "Patients", patientId, "Visits"), {
            date,
            diagnosis,
            note,
            createdAt: new Date()
          });
          toast.success("Wizyta dodana!", { position: "top-center" });
          setDate("");
          setDiagnosis("");
          setNote("");
          onReady();
        } catch (error) {
          console.error(error);
          toast.error("Błąd podczas dodawania wizyty!", { position: "top-center" });
        }
        
      };

    return(
         <div className="card mt-4 p-3 shadow-sm">
      <h5>Dodaj wizytę</h5>
      <form onSubmit={handleAddVisit}>
        <div className="mb-3">
          <div>
          <label>Data wizyty</label>
          </div>
          <input
            type="datetime-local"
            placeholder="Start"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Diagnoza</label>
          <input
            type="text"
            className="form-control"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Notatki</label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Zapisz wizytę</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>
          Anuluj
        </button>
      </form>
    </div>
    )
}

export default AddVisit
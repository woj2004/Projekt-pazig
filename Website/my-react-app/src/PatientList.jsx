import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("Musisz być zalogowany!", { position: "top-center" });
        return;
      }

      try {
        const patientsCollection = collection(db, "Users", user.uid, "Patients");
        const snapshot = await getDocs(patientsCollection);
        const patientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientsData);
      } catch (error) {
        console.error("Błąd podczas pobierania pacjentów:", error.message);
        toast.error("Nie udało się pobrać pacjentów", { position: "top-center" });
      }
    });

    return () => unsubscribe(); // czyścimy listener przy odmontowaniu
  }, []);

  // Filtrowanie pacjentów po imieniu, nazwisku lub PESEL
  const filteredPatients = patients.filter(patient =>
    `${patient.name} ${patient.surname} ${patient.pesel}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <Form.Control
        type="text"
        placeholder="Wyszukaj po imieniu, nazwisku lub numeru PESEL"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Imię</th>
            <th scope="col">Nazwisko</th>
            <th scope="col">Pesel</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <tr key={patient.id}>
                <th scope="row">{index + 1}</th>
                <td>{patient.name}</td>
                <td>{patient.surname}</td>
                <td>{patient.pesel}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Brak wyników</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PatientList;
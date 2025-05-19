import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import Patient from "./assets/Patient";
import Button from 'react-bootstrap/Button';

function PatientList({onClick1}) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      toast.error("Musisz być zalogowany!", { position: "top-center" });
      return;
    }

    const patientsCollection = collection(db, "Users", user.uid, "Patients");

    const unsubscribeSnapshot = onSnapshot(patientsCollection, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsData);
    }, (error) => {
      console.error("Błąd podczas pobierania pacjentów:", error.message);
      toast.error("Nie udało się pobrać pacjentów", { position: "top-center" });
    });

    // Cleanup
    return () => {
      unsubscribeSnapshot();
    };
  });

  return () => unsubscribeAuth(); // cleanup auth listener
}, []);

  // Filtrowanie pacjentów po imieniu, nazwisku lub PESEL
  const filteredPatients = patients.filter(patient =>
    `${patient.name} ${patient.surname} ${patient.pesel}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="container mt-4">
      { selectedPatientId ? (
       
        <Patient
          patientId={selectedPatientId}
          patient={patients.find(p => p.id === selectedPatientId)}
          onClose={() => setSelectedPatientId(null)}
        />) : ( <>
        <div className="d-flex justify-content-end gap-3 mt-3 me-3 mb-3">
        <Button type="button" className="btn btn-dark" onClick={onClick1}>
          Dodaj pacjenta!
        </Button>
        </div>
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
              <tr key={patient.id} style={{ cursor: "pointer" }}  onClick={() => setSelectedPatientId(patient.id)}>
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
      </table> </>
        )}
    </div>
  );
}

export default PatientList;
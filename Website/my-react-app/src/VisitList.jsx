import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";

function VisitList({ patientId}) {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    if (!patientId) return;                

    const user = auth.currentUser;
    if (!user) {
      toast.error("Musisz być zalogowany!", { position: "top-center" });
      return;
    }

    const visitsRef = collection(
      db,
      "Users",
      user.uid,
      "Patients",
      patientId,
      "Visits"
    );

    const unsubscribe = onSnapshot(
      visitsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVisits(data);
      },
      (error) => {
        console.error("Błąd podczas pobierania wizyt:", error.message);
        toast.error("Nie udało się pobrać wizyt", {
          position: "top-center",
        });
      }
    );

    return () => unsubscribe();            
  }, [patientId]);                         
  return (
    <div className="container mt-3">
      

      {visits.length === 0 ? (
        <p>Brak wizyt.</p>
      ) : (
        visits.map((visit, index) => (
          <div className="card mb-3" key={visit.id}>
            <div className="card-header">Wizyta #{index + 1}</div>
            <div className="card-body">
              <h5 className="card-title text-start">Diagnoza: {visit.diagnosis}</h5>
              <p className="card-text  text-start">{visit.note}</p>
              <p className="card-text">
                <small className="text-muted">Data: {visit.date.replace("T"," ")}</small>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VisitList;

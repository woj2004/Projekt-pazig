import React, { useState } from "react";
import { auth, db } from "./Firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal';

function AddPatient({ showForm, setShowForm }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pesel, setPesel] = useState("");
  const [email, setEmail] = useState(""); 

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("Musisz być zalogowany!", { position: "top-center" });
      return;
    }

    try {
      await addDoc(collection(db, "Users", user.uid, "Patients"), {
        name,
        surname,
        pesel,
        email, 
        createdAt: new Date()
      });
      toast.success("Pacjent dodany!", { position: "top-center" });
      setName("");
      setSurname("");
      setPesel("");
      setEmail(""); 
    } catch (error) {
      console.error(error);
      toast.error("Błąd podczas dodawania pacjenta", { position: "top-center" });
    }
    setShowForm(false);
  };

  return (
    <div>
      {showForm ? (
        <Modal show={showForm} onHide={() => setShowForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Nowy Pacjent</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddPatient}>
              <h3>Dodaj pacjenta</h3>

              <div className="mb-3">
                <label>Imię</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Nazwisko</label>
                <input
                  type="text"
                  className="form-control"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>PESEL</label>
                <input
                  type="text"
                  className="form-control"
                  value={pesel}
                  onChange={(e) => setPesel(e.target.value)}
                  maxLength="11"
                  pattern="\d{11}"
                  required
                />
              </div>

              <div className="mb-3">
                <label>E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail"
                />
              </div>

              <button type="submit" className="btn btn-success">Dodaj</button>
            </form>
          </Modal.Body>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default AddPatient;

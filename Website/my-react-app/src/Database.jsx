import NavBar from "./navbar";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import AddPatient from "./AddPatient";
import PatientList from "./PatientList";

function Database(){
    const [showForm, setShowForm] = useState(false);
return(
<>     
<NavBar />
<div className="d-flex justify-content-end mt-3 me-3">
  <Button type="button" className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
    Dodaj pacjenta!
  </Button>
</div>
<PatientList />
<AddPatient showForm={showForm} setShowForm={setShowForm} />
</>
);
}

export default Database
import NavBar from "./navbar";
import { useState } from "react";
import AddPatient from "./AddPatient";
import PatientList from "./PatientList";

function Database(){
    const [showForm, setShowForm] = useState(false);
return(
<>     
<NavBar />
<PatientList onClick1={() => setShowForm(!showForm)}/>
<AddPatient showForm={showForm} setShowForm={setShowForm} />
</>
);
}

export default Database
import Calendar from "./Calendar";
import NavBar from "./navbar";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

function App() {

  const [patients, setPatients] = useState([
    { id: 1, imie: "Anna", nazwisko: "Kowalska" },
    { id: 2, imie: "Jan", nazwisko: "Nowak" },
    { id: 3, imie: "Katarzyna", nazwisko: "Wiśniewska" },
  ]);
  
  return(
    <div className="app-background">
      <div style={{ marginBottom: '2rem' }}>
       <NavBar />
      </div>
        <Calendar patients={patients} setPatients={setPatients} />
    </div>
  );
}

export default App

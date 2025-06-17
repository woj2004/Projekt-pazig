import { useState } from "react"
import AddVisit from "./AddVisit";
import VisitList from "./VisitList";


function Patient({ patientId, onClose, patient }){
const [visible, setVisible] = useState(false);

    return(
        visible? (
    <>
    <AddVisit patientId={patientId} onClose={() => setVisible(false)} onReady={() => setVisible(false)}></AddVisit>
    </>) : (
        <>
        <h5>{patient?.name} {patient?.surname}</h5>
        <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Wyjdź</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => setVisible(true)}>Dodaj Wizytę!</button>
        <VisitList patientId={patientId}></VisitList>
        </>
        )
    )
}

export default Patient
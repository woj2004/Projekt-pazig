import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


function Forms({showForm, setShowForm, patients, setPatients, addEvent}){
   
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('');

    const handleSave = () => {
        if (selectedPatientId && startTime && duration) {
          addEvent(selectedPatientId, startTime, duration);
          setShowForm(false);  
          
          setSelectedPatientId('');
          setStartTime('');
          setDuration('');
          console.log('save działa')
        } else {
          alert("Uzupełnij wszystkie pola!");
        }
      };

    return(
        <div>
            {showForm? 
            <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
          >
            <Modal show={showForm} onHide={() => setShowForm(false)} centered>
              <Modal.Header>
                <Modal.Title>Nowa wizyta</Modal.Title>
              </Modal.Header>
      
              <Modal.Body>
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedPatientId ? patients.find(p => p.id === selectedPatientId)?.imie + ' ' + patients.find(p => p.id === selectedPatientId)?.nazwisko : "Wybierz pacjenta"}
                >
                {patients.map((p) => (
                    <Dropdown.Item key={p.id} onClick={() => {setSelectedPatientId(p.id),console.log("pacjent zaznaczony")}}>
                    {p.imie} {p.nazwisko}
                    </Dropdown.Item>
                ))}
                </DropdownButton>
                <input
                  type="datetime-local"
                  placeholder="Start"
                  value={startTime}                  
                  onChange={(e) => setStartTime(e.target.value)}  
                  className="form-control mt-2"
                />
                <input
                  type="number"
                  placeholder="Czas trwania (min)"
                  value={duration}                        
                onChange={(e) => setDuration(e.target.value)}  
                className="form-control mt-2"
                />

              </Modal.Body>
      
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Zamknij</Button>
                <Button variant="primary" onClick={() => {handleSave()}}>
                Zapisz
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
            : 
            <div></div>}
           
        </div>
    );
}

export default Forms
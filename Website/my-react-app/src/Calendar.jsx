import React, { useState, useEffect } from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import Forms from './Forms';
import Button from 'react-bootstrap/Button';
import "./index.css"

function Calendar({patients,setPatients}){

    const config = {
        viewType: "Week",
        durationBarVisible: false,
    };
    
    const [startDate, setStartDate] = useState(0);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const addEvent = (patientId, startTime, durationMinutes) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient || !startTime || !durationMinutes) return;
      
        const start = new DayPilot.Date(startTime + ':00');
        const end = start.addMinutes(parseInt(durationMinutes));
      
        const newEvent = {
          id: events.length + 1,
          text: `${patient.imie} ${patient.nazwisko}`,
          start: start.toString(),
          end: end.toString()
        };
      
        setEvents([...events, newEvent]);
      };
    

    return(
        <div  style={{ marginLeft: '2rem', marginRight: '2rem' }}>
            <Forms showForm={showForm} setShowForm={setShowForm} patients={patients} setPatients={setPatients} addEvent={addEvent}></Forms>
        <div style={{display: 'flex'}}>
            
            <div style={{marginRight: '10px'}}>
                <DayPilotNavigator showMonths={3} selectionDay={startDate} onTimeRangeSelected={ args => {setStartDate(args.day);}}/>
            </div>            
            <div className={"calendar"} style={{flexGrow: '1'}}>
                <DayPilotCalendar /*theme='calendar'*/ {...config} events = {events} startDate={startDate === 0 ? undefined : startDate}/>   
            </div>          
                
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                <Button variant="primary" style={{backgroundColor: '#3B5D36', borderColor:'#3B5D36',  width: '65%'}} size="lg" onClick={() => setShowForm(!showForm)}>Dodaj wizytę!</Button>
        </div>
        </div>
    );
}

export default Calendar;
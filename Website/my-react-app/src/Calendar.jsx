import React, { useState, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import Forms from './Forms';
import Button from 'react-bootstrap/Button';
import { auth, db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import "./index.css";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { query, where, Timestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";

function Calendar() {
  const config = {
    viewType: "Week",
    durationBarVisible: false,
  };

  


async function sendRemindersViaEmailService(reminders) {
  for (const reminder of reminders) {
    await emailjs.send(
      "service_gzg3kg9",       
      "template_g6ooy1t",      
      {
        title: "Przypomnienie o wizycie",
        name: reminder.name,   
        time: reminder.time,   
        message: reminder.message, 
        to_email: reminder.to  
      },
      "MtLCp5CiAPtXbJFZG"        
    );
  }
}

const sendEmailReminders = async () => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Musisz być zalogowany!", { position: "top-center" });
    return;
  }

  const start = new DayPilot.Date(startDate).firstDayOfWeek();
  const end = start.addDays(7);

  const patientsSnapshot = await getDocs(collection(db, "Users", user.uid, "Patients"));
  const reminders = [];

  for (const patientDoc of patientsSnapshot.docs) {
    const patientId = patientDoc.id;
    const patient = patientDoc.data();
    if (!patient.email) continue;

    const visitsRef = collection(db, "Users", user.uid, "Patients", patientId, "Visits");
    const visitsSnapshot = await getDocs(visitsRef);

    visitsSnapshot.forEach((visitDoc) => {
      const visit = visitDoc.data();
      let rawDate = visit.date;
      if (!rawDate.includes(":")) {
        rawDate += "T08:00:00";
      } else if (rawDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        rawDate += ":00";
      }
      const visitDate = new DayPilot.Date(rawDate);

      if (visitDate >= start && visitDate < end) {
        reminders.push({
          to: patient.email,
          name: `${patient.name} ${patient.surname}`,
          time: visitDate.toString("yyyy-MM-dd HH:mm"),
          message: "Prosimy o potwierdzenie obecności lub kontakt w razie zmiany terminu."
        });
      }
    });
  }

  if (reminders.length === 0) {
    toast.info("Brak wizyt do przypomnienia w tym tygodniu.", { position: "top-center" });
    return;
  }

  try {
    await sendRemindersViaEmailService(reminders);
    toast.success("Wysłano przypomnienia!", { position: "top-center" });
  } catch (error) {
    console.error("Błąd wysyłania maili:", error);
    toast.error("Błąd podczas wysyłania przypomnień", { position: "top-center" });
  }
};

  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      toast.error("Musisz być zalogowany!", { position: "top-center" });
      return;
    }

    try {
      const patientsSnapshot = await getDocs(collection(db, "Users", user.uid, "Patients"));
      const eventList = [];

      for (const patientDoc of patientsSnapshot.docs) {
        const patientId = patientDoc.id;
        const patientData = patientDoc.data();
        const visitsRef = collection(db, "Users", user.uid, "Patients", patientId, "Visits");
        const visitsSnapshot = await getDocs(visitsRef);

        visitsSnapshot.forEach((visitDoc) => {
          const visit = visitDoc.data();
          const dateStr = visit.date.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
            ? visit.date + ":00"
            : visit.date;
          const start = new DayPilot.Date(dateStr);
          const end = start.addMinutes(30);

          eventList.push({
            id: visitDoc.id,
            text: `${patientData.name} ${patientData.surname}`,
            start: start.toString(),
            end: end.toString(),
          });
        });
      }

      setEvents(eventList);
    } catch (error) {
      console.error("Błąd pobierania danych z Firestore:", error);
      toast.error("Nie udało się załadować wizyt", { position: "top-center" });
    }
  });

  return () => unsubscribeAuth();
}, []);

  return (
    <div style={{ marginLeft: '2rem', marginRight: '2rem' }}>
      <Forms showForm={showForm} setShowForm={setShowForm} patients={null} setPatients={null} addEvent={() => {}} />
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <DayPilotNavigator
            showMonths={3}
            selectionDay={startDate}
            onTimeRangeSelected={(args) => setStartDate(args.day)}
          />
        </div>
        <div className="calendar" style={{ flexGrow: '1' }}>
          <DayPilotCalendar
            {...config}
            events={events}
            startDate={startDate}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        
          <Button
          variant="success"
          size="lg"
          onClick={sendEmailReminders}
          style={{ marginTop: '1rem', width: '65%' }}
        >
          Wyślij przypomnienia e-mail!
        </Button>
      </div>
      
    </div>
  );
}

export default Calendar;
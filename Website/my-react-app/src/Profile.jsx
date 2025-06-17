import Calendar from "./Calendar";
import NavBar from "./navbar";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Button from "react-bootstrap/esm/Button";

function Profile() {

  
  
  return(
    <div className="app-background">
      <div style={{ marginBottom: '2rem' }}>
       <NavBar />
      </div>
        <Calendar/>
    </div>
  );
}

export default Profile

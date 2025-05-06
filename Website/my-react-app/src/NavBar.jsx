import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { auth } from './Firebase'

function NavBar(){
  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
       <>
        <Navbar style={{ backgroundColor: "#3B5D36" }} variant="dark" expand="lg">
        <Container fluid>
            <Nav className="d-flex flex-row align-items-center">
            <Navbar.Brand href="#home" className="me-3">Baza Przychodni</Navbar.Brand>
            <Nav.Link href="/Profile">Kalendarz</Nav.Link>
            <Nav.Link href="/Database">Pacjenci</Nav.Link>
              <button type="button" class="btn btn-outline-danger" onClick={handleLogout}>Wyloguj się</button>
            </Nav>
        </Container>
        </Navbar>

       </>
  );
}

export default NavBar;
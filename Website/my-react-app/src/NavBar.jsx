import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar(){
  return (
       <>
        <Navbar style={{ backgroundColor: "#3B5D36" }} variant="dark" expand="lg">
        <Container fluid>
            <Nav className="d-flex flex-row align-items-center">
            <Navbar.Brand href="#home" className="me-3">Baza Przychodni</Navbar.Brand>
            <Nav.Link href="#home">Kalendarz</Nav.Link>
            <Nav.Link href="#features">Pacjenci</Nav.Link>
            </Nav>
        </Container>
        </Navbar>

       </>
  );
}

export default NavBar;
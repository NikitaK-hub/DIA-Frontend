import React from "react";
import { Navbar as BootstrapHeader, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "./routes";
import { BreadCrumbs } from "./BreadCrumbs";
import '../styles/global.css';

const Header: React.FC = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): { label: string; path?: string }[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [];

    // Для главной страницы показываем только ссылку на издержки
    if (location.pathname === "/" || location.pathname === ROUTES.HOME) {
      crumbs.push({ label: "Издержки", path: ROUTES.COSTS });
    }
    // Для страницы издержек (список)
    else if (location.pathname === ROUTES.COSTS) {
      crumbs.push({ label: "Издержки" });
    }
    // Для детальной страницы издержки
    else if (pathnames[0] === "costs" && pathnames[1]) {
      crumbs.push({ label: "Издержки", path: ROUTES.COSTS });
      crumbs.push({ label: `${pathnames[1]}` });
    }

    return crumbs;
  };

  const crumbs = generateBreadcrumbs();

  return (
    <>
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
        rel="stylesheet" 
      />
      
      <BootstrapHeader expand="lg" className="custom-Header">
        <Container fluid>
          <BootstrapHeader.Brand>
            <Container className="header">
              <Nav.Link as={Link} to="/" className="header" active={location.pathname === "/"}>
                <img src="../public/Logo.png" alt="Logo" />
              </Nav.Link>
              <span>Economy Scale</span>
              
              {/* Хлебные крошки */}
              <Container className="breadCrumbs">
                <BreadCrumbs crumbs={crumbs} />
              </Container>
            </Container>
          </BootstrapHeader.Brand>
          
          <h1>Экономия за счет масштаба</h1>
          <h5>Расчет эффекта масштаба</h5>
        </Container>
      </BootstrapHeader>
    </>
  );
};

export default Header;
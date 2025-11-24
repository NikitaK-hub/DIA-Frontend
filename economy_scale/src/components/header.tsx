import React, { useState} from "react";
import { Navbar as BootstrapHeader, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "./routes";
import { BreadCrumbs } from "./BreadCrumbs";
import '../styles/global.css';

const Header: React.FC = () => {
  const location = useLocation();
  const [costTitle] = useState<string | null>(null);

  const generateBreadcrumbs = (): { label: string; path?: string }[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [];

    if (pathnames[0] === "costs") {
      crumbs.push({ label: "Издержки", path: ROUTES.COSTS });

      if (pathnames[1]) {
        const costId = Number(pathnames[1]);
        if (!isNaN(costId)) {
          const label = costTitle || `${costId}`;
          crumbs.push({ label, path: location.pathname });  
        }
      }
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
                <img src="../public/Logo.png" />
              </Nav.Link>
              <span>Economy Scale</span>
              {crumbs.length > 0 && (
                <Container className="breadCrumbs">
                  <BreadCrumbs crumbs={crumbs} />
                </Container>
              )}
            </Container>
          </BootstrapHeader.Brand>
          
            <h1>
              Экономия за счет масштаба
            </h1>
            <h5>
              Расчет эффекта масштаба
            </h5>

        </Container>
      </BootstrapHeader>
    </>
  );
};

export default Header;
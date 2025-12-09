import React from "react";
import { 
  Navbar as BootstrapHeader, 
  Nav, 
  Container,
  Button 
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { BreadCrumbs } from "./BreadCrumbs";
import '../styles/global.css';
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logoutUserAsync } from "../store/userSlice";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const username = useSelector((state: RootState) => state.user.username);
  const isAuthorized = useSelector((state: RootState) => state.user.isAuthorized);

  const handleExit = async () => {
    await dispatch(logoutUserAsync());
    navigate(ROUTES.HOME);
  };

  const generateBreadcrumbs = (): { label: string; path?: string }[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [];

    if (location.pathname === "/" || location.pathname === ROUTES.HOME) {
      crumbs.push({ label: "Издержки", path: ROUTES.COSTS });
    }
    else if (location.pathname === ROUTES.COSTS) {
      crumbs.push({ label: "Издержки" });
    }
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
      
      <BootstrapHeader 
        expand="lg" 
        className="header-navbar"
        style={{ backgroundColor: 'transparent', border: 'none' }}
      >
        <Container fluid className="header-container" style={{ backgroundColor: 'transparent' }}>
          {/* Левая часть: логотип, название и хлебные крошки */}
          <div className="header-left-section" style={{ backgroundColor: 'transparent' }}>
            <div className="logo-and-title">
              <Nav.Link as={Link} to="/" className="logo-link" style={{ backgroundColor: 'transparent' }}>
                <img src="/DIA-Frontend/logo.png" alt="Logo" className="logo-img" />
              </Nav.Link>
              <span className="brand-title">Economy Scale</span>
            </div>
            {crumbs.length > 0 && (
              <div className="breadcrumbs-wrapper-left">
                <BreadCrumbs crumbs={crumbs} />
              </div>
            )}
          </div>

          {/* Центральная часть: заголовки */}
          <div className="header-center-section" style={{ backgroundColor: 'transparent' }}>
            <h1 className="main-title">Экономия за счет масштаба</h1>
            <h5 className="sub-title">Расчет эффекта масштаба</h5>
          </div>

          {/* Правая часть: авторизация */}
          <div className="header-auth-section" style={{ backgroundColor: 'transparent' }}>
            {!isAuthorized ? (
              <div className="auth-buttons" style={{ backgroundColor: 'transparent' }}>
                <Link to={ROUTES.LOGIN}>
                  <Button className="auth-btn login-btn">Войти</Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button className="auth-btn register-btn" variant="outline-primary">
                    Регистрация
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="user-profile-section" style={{ backgroundColor: 'transparent' }}>
                <Button
                  variant="primary"
                  className="auth-btn logout-btn"
                  onClick={handleExit}
                >
                  Выйти
                </Button>
                <Link to={ROUTES.PROFILE} className="user-link">
                  <div className="user-info">
                    <div className="user-avatar">
                      {username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="username-text">{username || 'Пользователь'}</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </BootstrapHeader>
    </>
  );
};

export default Header;
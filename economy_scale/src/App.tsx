import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import { HomePage } from "./pages/home";
import { CostsPage } from "./pages/costs";
import { CostPage } from "./pages/cost";
import { RegisterPage } from "./pages/registerPage";
import { ProfilePage } from "./pages/profilePage";
import { LoginPage } from "./pages/loginPage";
import { CostRequestPage } from "./pages/costRequest";
// import { RequestsListPage } from "./pages/requestsListPage";
import "./styles/App.css";


const App: React.FC = () => {
  return (
    <>
      <Header />
      <Container className="main-container">
        {/*<BreadCrumbs crumbs={[{ label: ROUTE_LABELS.COSTS }]} />*/}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/costs" element={<CostsPage />} />
          <Route path="/costs/:id" element={<CostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cost-request/:id" element={<CostRequestPage />} />
          {/* <Route path="/requests" element={<RequestsListPage />} /> */}
        </Routes>
      </Container>
    </>
  );
};

export default App;
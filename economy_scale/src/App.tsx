// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { AlbumPage } from "./pages/AlbumPage";
// import ITunesPage from "./pages/ITunesPage";
// import { ROUTES } from "../Routes";
// import { HomePage } from "./pages/HomePage";
// import Navigation from "./components/Navigation";

// function App() {
//   return (
//     <BrowserRouter>
//     <Navigation/>
//       <Routes>
//         <Route path={ROUTES.HOME} index element={<HomePage />} />
//         <Route path={ROUTES.ALBUMS} element={<ITunesPage />} />
//         <Route path={`${ROUTES.ALBUMS}/:id`} element={<AlbumPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import { HomePage } from "./pages/home";
import { CostsPage } from "./pages/costs";
import { CostPage } from "./pages/cost";
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
        </Routes>
      </Container>
    </>
  );
};

export default App;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { FC } from "react";
import { ROUTES } from "./routes";
import '../styles/global.css';
import '../styles/components/BreadCrumbs.css'

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: ICrumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = (props) => {
  const { crumbs } = props;
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === ROUTES.HOME;

  return (
    <ul className="breadCrumbs">
      <li className="breadCrumbItem">
        {isHomePage ? (
          <span className="breadCrumbCurrent">Главная</span>
        ) : (
          <Link to={ROUTES.HOME} className="breadCrumbLink">
            Главная
          </Link>
        )}
      </li>
      
      {/* Отображаем остальные крошки только если мы НЕ на главной странице */}
      {!isHomePage && crumbs.length > 0 &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="slash">/</li>
            <li className="breadCrumbItem">
              {crumb.path ? (
                <Link to={crumb.path} className="breadCrumbLink">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadCrumbCurrent">{crumb.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
    </ul>
  );
};
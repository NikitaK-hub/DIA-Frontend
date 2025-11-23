import React from "react";
import { Link } from "react-router-dom";
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

  return (
    <ul className="breadCrumbs">
      <li className="breadCrumbItem">
        <Link to={ROUTES.HOME} className="breadCrumbLink">
          Главная
        </Link>
      </li>
      {crumbs.length > 0 &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="slash">/</li>
            <li className="breadCrumbItem">
              {index === crumbs.length - 1 ? (
                <span className="breadCrumbCurrent">{crumb.label}</span>
              ) : (
                <Link to={crumb.path || "#"} className="breadCrumbLink">
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
    </ul>
  );
};
import { type FC, useEffect, useState } from "react";
import { getAllCostRequests } from "../store/requestsSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const RequestsListPage: FC = () => {
  const { requests } = useSelector((state: RootState) => state.requests);
  const [requestClicked, setRequestClicked] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const status = e.target.value;
    switch (status) {
      case "formed":
        dispatch(getAllCostRequests({ status: 3 }));
        break;
      case "approved":
        dispatch(getAllCostRequests({ status: 4 }));
        break;
      case "rejected":
        dispatch(getAllCostRequests({ status: 5 }));
        break;
      default:
        dispatch(getAllCostRequests());
        break;
    }
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateFrom = e.target.value;
    dispatch(getAllCostRequests({ dateFrom }));
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTo = e.target.value;
    dispatch(getAllCostRequests({ dateTo }));
  };

  const handleRequestClick = (id: number) => {
    setRequestId(id);
    setRequestClicked(true);
  };

  const handleTransitionButtonClick = () => {
    navigate(`/cost-request/${requestId}`);
  };

  useEffect(() => {
    dispatch(getAllCostRequests());
  }, [dispatch]);

  return (
    <div className="requests-list-page">
      <h1 className="requests-label">Заявки</h1>
      <div className="filters">
        <div className="filter-item">
          <label className="filter-label">Статус</label>
          <select className="filter-select" onChange={handleStatusFilterChange}>
            <option value="all">Все</option>
            <option value="formed">Сформирована</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата начала</label>
          <input
            className="filter-input"
            placeholder="Дата начала"
            onChange={handleDateFromChange}
            type="date"
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата окончания</label>
          <input
            className="filter-input"
            placeholder="Дата окончания"
            onChange={handleDateToChange}
            type="date"
          />
        </div>
      </div>
      <table className="request-table">
        <thead className="columns-name">
          <tr>
            <th>#</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата оформления</th>
            <th>Дата завершения</th>
            <th>Эффект масштаба</th>
          </tr>
        </thead>
        <tbody>
          {requests.length ? (
            requests.map((request) => (
              <tr
                key={request.requestId}
                onClick={() => handleRequestClick(request.requestId)}
              >
                <td>{request.requestId}</td>
                {(() => {
                  switch (request.status) {
                    case 3:
                      return <td>Сформирована</td>;
                    case 4:
                      return <td>Одобрена</td>;
                    default:
                      return <td>Отклонена</td>;
                  }
                })()}
                <td>{request.createdAt?.toLocaleString()}</td>
                {!request.closedAt && !request.formedAt ? (
                  <td>Не оформлена</td>
                ) : (
                  <td>{request.formedAt?.toLocaleString()}</td>
                )}
                {!request.closedAt && request.formedAt ? (
                  <td>Не завершена</td>
                ) : (
                  <td>{request.closedAt?.toLocaleString()}</td>
                )}
                <td>{request.ratio}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Нет заявок</td>
            </tr>
          )}
        </tbody>
      </table>
      {requestClicked && (
        <Button
          className="transition-button"
          onClick={handleTransitionButtonClick}
        >
          Перейти к заявке
        </Button>
      )}
    </div>
  );
};
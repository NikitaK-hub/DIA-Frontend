import { type FC, useEffect, useState } from "react";
import {
  getAllCostRequests,
  rejectRequest,
  resolveRequest,
} from "../store/requestsSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../modules/ratioAPI";

export const RequestsListPage: FC = () => {
  const { requests } = useSelector((state: RootState) => state.requests);
  const [requestClicked, setRequestClicked] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const isModerator = useSelector((state: RootState) => state.user.isModerator);

  // Получаем информацию о выбранной заявке
  const selectedRequest = requestId
    ? requests.find((request) => request.requestId === requestId)
    : null;

  // Состояние для отслеживания расчета
  // const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculating] = useState(false);

  // Функция для получения сегодняшней даты в формате YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const status = e.target.value;
    switch (status) {
      case "formed":
        dispatch(getAllCostRequests({ status: 3, dateFrom, dateTo }));
        break;
      case "approved":
        dispatch(getAllCostRequests({ status: 4, dateFrom, dateTo }));
        break;
      case "rejected":
        dispatch(getAllCostRequests({ status: 5, dateFrom, dateTo }));
        break;
      default:
        dispatch(getAllCostRequests({ dateFrom, dateTo }));
        break;
    }
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setDateFrom(date);
    dispatch(getAllCostRequests({ dateFrom: date || undefined, dateTo }));
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setDateTo(date);
    dispatch(getAllCostRequests({ dateFrom, dateTo: date || undefined }));
  };

  const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = e.target.value;
    setSelectedUser(selectedUser);
  };

  const handleRequestClick = (id: number) => {
    setRequestId(id);
    setRequestClicked(true);
  };

  const handleTransitionButtonClick = () => {
    if (requestId) {
      navigate(`/cost-request/${requestId}`);
    }
  };

  // Функция для одобрения выбранной заявки (статус 4)
  const handleApproveSelected = async () => {
    if (!requestId || !selectedRequest || selectedRequest.status !== 3) return;
    const costRequest = (await api.costRequests.resolveUpdate(requestId)).data;
    while (true) {
      const cost = (await api.costRequests.costRequestsList())
        .data;
      if (costRequest.Ratio) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // while (true) {
    //   const costRequest = (await api.costRequests.resolveUpdate(requestId))
    //     .data;
    //   if (costRequest.Ratio) {
    //     break;
    //   }
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // }

    dispatch(getAllCostRequests({ dateFrom, dateTo }));

    await dispatch(resolveRequest(requestId)).unwrap();

    dispatch(getAllCostRequests({ dateFrom, dateTo }));

    setRequestClicked(false);
    setRequestId(null);
  };

  // Функция для отклонения выбранной заявки (статус 5)
  const handleRejectSelected = async () => {
    if (!requestId || !selectedRequest || selectedRequest.status !== 3) return;

    try {
      await dispatch(rejectRequest(requestId)).unwrap();
      dispatch(getAllCostRequests({ dateFrom, dateTo }));

      setRequestClicked(false);
      setRequestId(null);
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
    }
  };

  // Функция для форматирования даты
  const formatDate = (date?: Date) => {
    if (!date) return "-";
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Функция для форматирования числа с ограничением знаков после запятой
  const formatRatio = (ratioValue: any) => {
    if (ratioValue === null || ratioValue === undefined) {
      return "Нет данных";
    }
    
    const numValue = Number(ratioValue);
    if (isNaN(numValue)) {
      return "Нет данных";
    }
    
    // Ограничиваем до 5 знаков после запятой
    return numValue.toFixed(5);
  };

  // Функция для отображения результата расчета в зависимости от статуса
  const renderScaleEffect = (request: any) => {
    // Только для статуса 4 (Одобрена) показываем результат
    if (request.status === 4) {
      // Используем ratio, если он есть (даже если равен 0)
      const ratioValue = request.ratio;
      
      // Явно проверяем, что значение не null и не undefined
      // Значение 0 проходит эту проверку!
      if (ratioValue !== null && ratioValue !== undefined) {
        const formattedValue = formatRatio(ratioValue);
        return `${formattedValue}%`;
      }
      // Если данных нет или они некорректны
      return "Нет данных";
    }

    // Для всех остальных статусов (3, 5 и любых других) - "Нет данных"
    return "Нет данных";
  };

  // Функция для отображения объема выпуска
  const renderVolume = (volume?: number) => {
    if (volume !== undefined && volume !== null) {
      return volume;
    }
    return "-";
  };

  // Получаем уникальных пользователей для фильтра
  const uniqueUsers = Array.from(
    new Set(
      requests
        .map((request) => request.username)
        .filter((username): username is string => !!username),
    ),
  );

  useEffect(() => {
    // Устанавливаем сегодняшнюю дату в оба поля при загрузке
    const today = getTodayDate();
    setDateFrom(today);
    setDateTo(today);
    
    // Загружаем заявки с сегодняшней датой
    dispatch(getAllCostRequests({ dateFrom: today, dateTo: today }));
  }, [dispatch]);

  return (
    <div className="requests-list-page">
      <h1 className="requests-label" style={{ marginLeft: "30%" }}>
        Заявки
      </h1>

      <div className={"filters " + (isModerator ? "moderator" : "")}>
        <div className="filter-item">
          <label className="filter-label">Статус</label>
          <select className="filter-select" onChange={handleStatusFilterChange}>
            <option defaultValue="all">Все</option>
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
            value={dateFrom}
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Дата окончания</label>
          <input
            className="filter-input"
            placeholder="Дата окончания"
            onChange={handleDateToChange}
            type="date"
            value={dateTo}
          />
        </div>
        {isModerator && (
          <div className="filter-item">
            <label className="filter-label">Пользователь</label>
            <select className="filter-select" onChange={handleUserSelection}>
              <option value="">Все пользователи</option>
              {uniqueUsers.map((username) => (
                <option key={username} value={username}>
                  {username}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <table className="request-table">
        <thead className="columns-name">
          <tr>
            <th>#</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата оформления</th>
            <th>Дата завершения</th>
            <th>1-ый выпуск</th>
            <th>2-ый выпуск</th>
            <th>Эффект масштаба</th>
            {isModerator && <th>Пользователь</th>}
          </tr>
        </thead>
        <tbody>
          {requests.length ? (
            requests
              .filter(
                (request) => !selectedUser || request.username === selectedUser,
              )
              .map((request) => (
                <tr
                  key={request.requestId}
                  onClick={() => handleRequestClick(request.requestId)}
                  className={
                    requestClicked && requestId === request.requestId
                      ? "selected-row"
                      : ""
                  }
                >
                  <td>{request.requestId}</td>
                  <td>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status === 1
                        ? "Черновик"
                        : request.status === 2
                          ? "На рассмотрении"
                          : request.status === 3
                            ? "Сформирована"
                            : request.status === 4
                              ? "Одобрена"
                              : request.status === 5
                                ? "Отклонена"
                                : "Неизвестно"}
                    </span>
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    {request.formedAt
                      ? formatDate(request.formedAt)
                      : "Не оформлена"}
                  </td>
                  <td>
                    {request.closedAt
                      ? formatDate(request.closedAt)
                      : request.formedAt
                        ? "Не завершена"
                        : "-"}
                  </td>
                  <td className="center-column-data">
                    {renderVolume(request.min_volume)}
                  </td>
                  <td className="center-column-data">
                    {renderVolume(request.max_volume)}
                  </td>
                  <td className="center-column-data">
                    {renderScaleEffect(request)}
                  </td>
                  {isModerator && (
                    <td className="center-column-data">
                      {request.username || "Неизвестно"}
                    </td>
                  )}
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={isModerator ? 9 : 8} className="text-center">
                Нет заявок
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {requestClicked && (
        <div className="action-buttons-container">
          {isModerator && selectedRequest && selectedRequest.status === 3 ? (
            // Для модератора: три кнопки в ряд
            <div className="three-buttons-row">
              <Button
                variant="danger"
                onClick={handleRejectSelected}
                className="action-button moderator-button reject-button"
                disabled={isCalculating}
              >
                Отклонить
              </Button>
              <Button
                className="action-button transition-button"
                onClick={handleTransitionButtonClick}
              >
                Перейти к заявке
              </Button>
              <Button
                variant="success"
                onClick={handleApproveSelected}
                className="action-button moderator-button approve-button"
                disabled={isCalculating}
              >
                {isCalculating ? "Расчет..." : "Одобрить"}
              </Button>
            </div>
          ) : (
            // Для обычного пользователя или для заявок не в статусе 3: только одна кнопка
            <Button
              className="action-button transition-button"
              onClick={handleTransitionButtonClick}
            >
              Перейти к заявке
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
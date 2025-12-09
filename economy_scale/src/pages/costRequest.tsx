import { useEffect, type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { Button } from "react-bootstrap";
import { Notification } from "../components/notification";
import { ROUTES } from "../components/routes";
import {
  loadRequests,
  loadCosts,
  loadRequestView,
  deleteRequest,
  clearCartCount,
} from "../store/requestSlice";
import type { RequestItem, CostItem, RequestViewItem } from "../store/requestSlice";

export const RequestPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Получаем данные из хранилища
  const { requests, costs, requestView, loading, error } = useSelector(
    (state: RootState) => state.request
  );

  // Состояние для уведомлений
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Состояние для расчета эффекта масштаба
  const [minVolume, setMinVolume] = useState<number>(1);
  const [maxVolume, setMaxVolume] = useState<number>(10);
  const [scaleEffectRatio, setScaleEffectRatio] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(loadRequests()),
          dispatch(loadCosts()),
          dispatch(loadRequestView())
        ]);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setNotification({
          message: "Не удалось загрузить данные заявки",
          type: "error",
        });
      }
    };

    fetchData();
  }, [dispatch]);

  // Обновляем данные из requestView при их изменении
  useEffect(() => {
    if (requestView.length > 0) {
      const view = requestView[0];
      setMinVolume(view.Min_volume || 1);
      setMaxVolume(view.Max_volume || 10);
      setScaleEffectRatio(view.Ratio || null);
    }
  }, [requestView]);

  // Обработчик удаления элемента из корзины
  const handleDeleteRequest = async (requestId: number) => {
    try {
      await dispatch(deleteRequest(requestId)).unwrap();
      
      // Обновляем счетчик корзины
      dispatch(clearCartCount());
      
      setNotification({
        message: "Элемент успешно удален из корзины",
        type: "success",
      });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      setNotification({
        message: "Не удалось удалить элемент из корзины",
        type: "error",
      });
    }
  };

  // Обработчик расчета эффекта масштаба
  const handleCalculateScaleEffect = async () => {
    if (minVolume >= maxVolume) {
      setNotification({
        message: "Максимальный объем должен быть больше минимального",
        type: "error",
      });
      return;
    }

    setIsCalculating(true);
    setNotification(null);

    try {
      // В реальном приложении здесь будет API вызов для расчета
      // Пока используем mock-расчет
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRatio = parseFloat((minVolume / maxVolume * 100).toFixed(2));
      setScaleEffectRatio(mockRatio);
      
      setNotification({
        message: "Расчет эффекта масштаба выполнен успешно",
        type: "success",
      });
    } catch (error) {
      console.error("Ошибка при расчете:", error);
      setNotification({
        message: "Ошибка при расчете эффекта масштаба",
        type: "error",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Обработчик изменения минимального объема
  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMinVolume(value);
    }
  };

  // Обработчик изменения максимального объема
  const handleMaxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMaxVolume(value);
    }
  };

  // Функция для получения услуги по ID
  const getCostById = (costId: number): CostItem | undefined => {
    return costs.find(cost => cost.ID === costId);
  };

  if (loading) {
    return (
      <div className="request-page">
        <div className="loading-container">
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-page">
        <div className="error-container">
          <p>Ошибка: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="request-page">
      <h1 className="page-title">Корзина заявок</h1>
      
      <div className="request-container">
        {requests.length === 0 ? (
          <div className="empty-cart">
            <h2>Корзина пуста</h2>
            <p>Добавьте услуги в корзину для оформления заявки</p>
            <Button 
              className="browse-services-btn"
              onClick={() => navigate(ROUTES.SERVICES)}
            >
              Перейти к услугам
            </Button>
          </div>
        ) : (
          <>
            <div className="requests-list">
              {requests.map((request) => {
                const cost = getCostById(request.Cost_id);
                if (!cost) return null;

                return (
                  <div key={request.id} className="request-item">
                    <div className="request-content">
                      <div className="cost-card">
                        <h3 className="cost-title">{cost.Title}</h3>
                        <img 
                          src={cost.Img} 
                          alt={cost.Title}
                          className="cost-image"
                        />
                      </div>
                      
                      <div className="request-details">
                        <div className="cost-price-section">
                          <span className="price-label">Стоимость</span>
                          <div className="price-value">
                            {request.Price} руб.
                          </div>
                        </div>
                        
                        <div className="request-actions">
                          <Button
                            className="delete-btn"
                            onClick={() => handleDeleteRequest(request.id)}
                            variant="outline-danger"
                          >
                            <img 
                              src="/static/img/bin.png" 
                              alt="Удалить"
                              className="bin-icon"
                            />
                            Удалить
                          </Button>
                          
                          {/* В будущем можно добавить кнопку "Основной" */}
                          {/* {request.Main ? (
                            <Button className="main-btn" disabled>
                              Основной
                            </Button>
                          ) : (
                            <Button className="not-main-btn" variant="outline-secondary">
                              Сделать основным
                            </Button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Секция расчета эффекта масштаба */}
            <div className="calculations-section">
              <div className="volume-inputs">
                <h3 className="section-title">Укажите объем выпуска</h3>
                
                <div className="volume-input-group">
                  <div className="volume-input">
                    <label htmlFor="min-volume">1-й выпуск</label>
                    <input
                      id="min-volume"
                      type="number"
                      min="1"
                      value={minVolume}
                      onChange={handleMinVolumeChange}
                      className="volume-input-field"
                    />
                  </div>
                  
                  <div className="volume-input">
                    <label htmlFor="max-volume">2-й выпуск</label>
                    <input
                      id="max-volume"
                      type="number"
                      min={minVolume + 1}
                      value={maxVolume}
                      onChange={handleMaxVolumeChange}
                      className="volume-input-field"
                    />
                  </div>
                </div>
              </div>
              
              <div className="calculation-controls">
                <Button
                  className="calculate-btn"
                  onClick={handleCalculateScaleEffect}
                  disabled={isCalculating || minVolume >= maxVolume}
                >
                  {isCalculating ? "Расчет..." : "Рассчитать эффект масштаба"}
                </Button>
              </div>
              
              {scaleEffectRatio !== null && (
                <div className="ratio-result">
                  <div className="ratio-value">
                    Коэффициент: {scaleEffectRatio}%
                  </div>
                  <div className="ratio-interpretation">
                    {scaleEffectRatio > 0 ? (
                      <p className="positive-effect">Положительный эффект масштаба</p>
                    ) : scaleEffectRatio < 0 ? (
                      <p className="negative-effect">Отрицательный эффект масштаба</p>
                    ) : (
                      <p className="neutral-effect">Нейтральный эффект масштаба</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.type === "error" ? 5000 : 3000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};
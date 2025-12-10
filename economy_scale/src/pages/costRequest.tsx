// pages/CostRequestPage.tsx
import { useEffect, type FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { Notification } from "../components/notification";
import { Button } from "react-bootstrap";
import { ROUTES } from "../components/routes";
import {
  getCostRequest,
  deleteCostRequest,
  setRequestData,
  updateCostRequest,
  setCosts,
  deleteCostFromRequest,
  updateCostInRequestAsync,
  formCostRequestAsync,
  updateCostPrice,
} from "../store/costRequestSlice";
import type { Costs, CostRequestInfo } from "../store/costRequestSlice";

export const CostRequestPage: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { costs, requestInfo, isDraft, error: requestError, loading } = useSelector(
    (state: RootState) => state.costRequest,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isForming, setIsForming] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalCosts, setOriginalCosts] = useState<Costs[]>([]);
  const [originalRequestInfo, setOriginalRequestInfo] = useState<CostRequestInfo | undefined>(undefined);
  const [hasChanges, setHasChanges] = useState(false);
  const [minVolume, setMinVolume] = useState<number>(1);
  const [maxVolume, setMaxVolume] = useState<number>(10);
  const [scaleRatio, setScaleRatio] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Загружаем данные заявки
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await dispatch(getCostRequest(Number(id)));
          if (getCostRequest.fulfilled.match(result)) {
            const requestData = result.payload;
            console.log('Request data from API:', requestData);
            
            // Сохраняем оригинальные данные для отмены изменений
            setOriginalCosts([...costs]);
            setOriginalRequestInfo({
              ...requestInfo,
              max_volume: requestData.Max_volume,
              min_volume: requestData.Min_volume,
              calculationResult: requestData.ratio,
            });
            
            // Устанавливаем значения для отображения
            if (requestData.Min_volume !== undefined) {
              setMinVolume(requestData.Min_volume);
            }
            if (requestData.Max_volume !== undefined) {
              setMaxVolume(requestData.Max_volume);
            }
            if (requestData.ratio !== undefined) {
              setScaleRatio(requestData.ratio);
            }
            
            // Устанавливаем данные в Redux
            dispatch(setRequestData({
              max_volume: requestData.Max_volume,
              min_volume: requestData.Min_volume,
              calculationResult: requestData.ratio,
            }));
          }
        } catch (error) {
          console.error("Ошибка загрузки заявки:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (requestInfo) {
      if (requestInfo.min_volume !== undefined) {
        setMinVolume(requestInfo.min_volume);
      }
      if (requestInfo.max_volume !== undefined) {
        setMaxVolume(requestInfo.max_volume);
      }
      if (requestInfo.calculationResult !== undefined) {
        setScaleRatio(requestInfo.calculationResult);
      }
    }
  }, [requestInfo]);

  console.log('Current costs in Redux:', costs);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      try {
        await dispatch(deleteCostRequest(Number(id))).unwrap();
        navigate(ROUTES.COSTS);
      } catch (error) {
        console.error(error);
        setNotification({
          message: "Ошибка при удалении заявки",
          type: "error",
        });
      }
    }
  };

  const handleDeleteCost = async (costId: number | undefined) => {
    if (costId && id) {
      try {
        await dispatch(
          deleteCostFromRequest({
            requestId: Number(id),
            costId: costId,
          }),
        ).unwrap();
        
        setNotification({
          message: "Издержка удалена из заявки",
          type: "success",
        });
      } catch (error) {
        console.error(error);
        setNotification({
          message: "Ошибка при удалении издержки",
          type: "error",
        });
      }
    }
  };

  // Обработчик изменения стоимости издержки
  const handleCostPriceChange = (costId: number | undefined, value: string) => {
    if (!costId) return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    // Обновляем в Redux
    dispatch(updateCostPrice({ costId, costPrice: numValue }));
    setHasChanges(true);
  };

  const handleMinVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMinVolume(value);
      dispatch(
        setRequestData({
          ...requestInfo,
          min_volume: value,
        }),
      );
      setHasChanges(true);
    }
  };

  const handleMaxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMaxVolume(value);
      dispatch(
        setRequestData({
          ...requestInfo,
          max_volume: value,
        }),
      );
      setHasChanges(true);
    }
  };

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
      setScaleRatio(mockRatio);
      
      setNotification({
        message: "Расчет эффекта масштаба выполнен успешно",
        type: "success",
      });
      
      dispatch(
        setRequestData({
          ...requestInfo,
          calculationResult: mockRatio,
        }),
      );
      setHasChanges(true);
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

  const handleRequestSave = async () => {
    if (id) {
      setIsSaving(true);
      setNotification(null);

      try {
        await handleRequestSaveInternal();
        setNotification({
          message: "Данные успешно сохранены!",
          type: "success",
        });
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
        setNotification({
          message: "Произошла ошибка при сохранении данных",
          type: "error",
        });
      } finally {
        setIsSaving(false);
        setHasChanges(false);
      }
    }
  };

  const handleFormRequest = async () => {
    if (id) {
      const isConfirmed = window.confirm(
        "Вы уверены, что хотите сформировать заявку? После формирования заявка будет отправлена модератору и вы не сможете её редактировать.",
      );

      if (!isConfirmed) {
        return;
      }

      setIsForming(true);
      setNotification(null);

      try {
        await handleRequestSaveInternal();
        await dispatch(formCostRequestAsync(Number(id))).unwrap();

        setNotification({
          message: "Заявка успешно сформирована и отправлена модератору!",
          type: "success",
        });

        setTimeout(() => {
          navigate(ROUTES.COSTS);
        }, 3000);
      } catch (error) {
        console.error("Ошибка при формировании заявки:", error);
        setNotification({
          message: "Произошла ошибка при формировании заявки",
          type: "error",
        });
      } finally {
        setIsForming(false);
      }
    }
  };

  const handleRequestSaveInternal = async (): Promise<void> => {
    if (!id) return;

    // Сохраняем объемы выпуска
    const requestParamsToSend = {
      ...requestInfo,
      id,
    };

    await dispatch(
      updateCostRequest({
        requestId: Number(id),
        requestInfo: requestParamsToSend,
      }),
    ).unwrap();

    // Сохраняем стоимость для каждой издержки
    for (const cost of costs) {
      if (cost.cost_id) {
        await dispatch(
          updateCostInRequestAsync({
            requestId: Number(id),
            costId: cost.cost_id,
            costPrice: cost.cost_price,
          }),
        ).unwrap();
      }
    }

    setOriginalCosts([...costs]);
    setOriginalRequestInfo({ ...requestInfo });
  };

  const handleCancelChanges = () => {
    if (originalCosts.length > 0) {
      dispatch(setCosts([...originalCosts]));
    }
    if (originalRequestInfo) {
      dispatch(setRequestData({ ...originalRequestInfo }));
    }
    setNotification({
      message: "Изменения отменены",
      type: "info",
    });
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="page-index">
        <div className="loadingBg">
          Загрузка...
        </div>
      </div>
    );
  }

  if (requestError) {
    return (
      <div className="page-index">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{requestError}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-index">
      <h1>Корзина заявок</h1>
      
      {/* Секция с издержками */}
      <div className="request">
        {costs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#FDF1E0'
          }}>
            <h2 style={{ marginBottom: '15px' }}>В заявке пока нет издержек</h2>
            <p style={{ marginBottom: '20px' }}>Добавьте издержки в заявку на странице услуг</p>
            <button 
              onClick={() => navigate(ROUTES.COSTS)}
              className="card_button"
              style={{ 
                margin: '0 auto',
                display: 'block'
              }}
            >
              Перейти к издержкам
            </button>
          </div>
        ) : (
          costs.map((requestItem) => {
            console.log('Rendering cost item:', requestItem);
            
            // Проверяем, есть ли необходимые данные для отображения
            if (!requestItem.cost_id || !requestItem.cost_title) {
              console.warn('Missing data for cost item:', requestItem);
              return null;
            }

            return (
              <div key={requestItem.cost_id} className="request_conteiner">
                <div className="class center">
                  <div className="card">
                    <h3>{requestItem.cost_title}</h3>
                    {requestItem.image_url && (
                      <img 
                        src={requestItem.image_url} 
                        alt={requestItem.cost_title}
                        style={{ 
                          width: '80%', 
                          height: '80%', 
                          marginTop: '3%', 
                          marginBottom: '5%' 
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="cost_navigation">
                  <div className="request_navigation">
                    <div className="cost_price">
                      Стоимость
                      <div className="input_price">
                        {isDraft ? (
                          <input
                            type="number"
                            value={requestItem.cost_price || ''}
                            onChange={(e) => handleCostPriceChange(requestItem.cost_id, e.target.value)}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'center',
                              fontSize: '25px',
                              color: '#000',
                              outline: 'none'
                            }}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                        ) : (
                          requestItem.cost_price || "0.00"
                        )}
                      </div>
                    </div>
                    {isDraft && (
                      <img 
                        src="DIA-Frontend/bin.png" 
                        style={{ 
                          height: '45px', 
                          width: '35px', 
                          cursor: 'pointer', 
                          marginLeft: '10%', 
                          marginTop: '5%' 
                        }} 
                        alt="Удалить"
                        onClick={() => handleDeleteCost(requestItem.cost_id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Секция расчетов */}
      <div className="calculations">
        <div className="volume">
          Укажите объем выпуска
          <div className="volume input">
            1-й выпуск
            <div className="input_volume">
              {isDraft ? (
                <input
                  type="number"
                  value={minVolume}
                  onChange={handleMinVolumeChange}
                  min="1"
                  style={{
                    width: '85px',
                    height: '40px',
                    textAlign: 'center',
                    border: '2px solid #145802',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#145802',
                    backgroundColor: 'transparent',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  width: '85px',
                  height: '40px',
                  textAlign: 'center',
                  paddingTop: '5px',
                  color: '#145802',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  {minVolume}
                </div>
              )}
            </div>
          </div>
          <div className="volume input">
            2-й выпуск
            <div className="input_volume">
              {isDraft ? (
                <input
                  type="number"
                  value={maxVolume}
                  onChange={handleMaxVolumeChange}
                  min={minVolume + 1}
                  style={{
                    width: '85px',
                    height: '40px',
                    textAlign: 'center',
                    border: '2px solid #145802',
                    borderRadius: '20px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#145802',
                    backgroundColor: 'transparent',
                    outline: 'none'
                  }}
                />
              ) : (
                <div style={{
                  width: '85px',
                  height: '40px',
                  textAlign: 'center',
                  paddingTop: '5px',
                  color: '#145802',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  {maxVolume}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isDraft && (
          <button 
            className="button_calculate"
            onClick={handleCalculateScaleEffect}
            disabled={isCalculating || minVolume >= maxVolume}
            style={{
              opacity: isCalculating || minVolume >= maxVolume ? 0.6 : 1,
              cursor: isCalculating || minVolume >= maxVolume ? 'not-allowed' : 'pointer'
            }}
          >
            {isCalculating ? 'Расчет...' : 'Рассчитать эффект масштаба'}
          </button>
        )}
        
        {scaleRatio !== null && (
          <div className="ratio">
            Коэффициент: {scaleRatio}
            <p style={{ paddingTop: '8px' }}>
              {scaleRatio > 0 ? 'Положительный эффект масштаба' : 'Отрицательный эффект масштаба'}
            </p>
          </div>
        )}
      </div>

      {/* Панель кнопок управления (только для черновиков) */}
      {isDraft && (
        <div className="request_button" style={{
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            className="card_button"
            onClick={handleRequestSave}
            disabled={isSaving}
            style={{
              backgroundColor: '#007bff',
              color: '#FDF1E0',
              borderColor: '#007bff'
            }}
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>

          <button
            className="card_button"
            onClick={handleCancelChanges}
            disabled={isSaving || !hasChanges}
            style={{
              borderColor: '#6c757d',
              color: '#6c757d',
              backgroundColor: 'transparent'
            }}
          >
            Отменить изменения
          </button>

          <button
            className="card_button"
            onClick={handleFormRequest}
            disabled={isSaving || isForming || hasChanges}
            style={{
              backgroundColor: '#28a745',
              color: '#FDF1E0',
              borderColor: '#28a745'
            }}
            title={
              hasChanges
                ? "Сохраните изменения перед формированием заявки"
                : "Отправить заявку модератору"
            }
          >
            {isForming ? "Формирование..." : "Сформировать"}
          </button>
          
          <button 
            className="card_button"
            onClick={handleDelete}
            style={{
              backgroundColor: '#dc3545',
              color: '#FDF1E0',
              borderColor: '#dc3545'
            }}
          >
            Удалить заявку
          </button>
        </div>
      )}

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
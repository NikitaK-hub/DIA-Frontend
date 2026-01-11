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
  deleteCostFromRequest,
  updateCostInRequestAsync,
  formCostRequestAsync,
  updateCostPrice,
} from "../store/costRequestSlice";
import { dest_root } from "../modules/target_config";

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
  const [hasChanges, setHasChanges] = useState(false);
  const [minVolume, setMinVolume] = useState<number>(1);
  const [maxVolume, setMaxVolume] = useState<number>(10);
  const [scaleRatio, setScaleRatio] = useState<number | null>(null);
  const [requestStatus, setRequestStatus] = useState<number>(0);
  const [savingCostIds, setSavingCostIds] = useState<Set<number>>(new Set()); // Для отслеживания сохранения отдельных издержек

  // Загружаем данные заявки
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const result = await dispatch(getCostRequest(Number(id)));
          if (getCostRequest.fulfilled.match(result)) {
            const requestData = result.payload;
            console.log('Request data from API:', requestData);
            
            // Устанавливаем значения для отображения
            if (requestData.Min_volume !== undefined) {
              setMinVolume(requestData.Min_volume);
            }
            if (requestData.Max_volume !== undefined) {
              setMaxVolume(requestData.Max_volume);
            }
            if (requestData.Ratio !== undefined) {
              setScaleRatio(requestData.Ratio);
            }
            
            // Сохраняем статус заявки
            if (requestData.status !== undefined) {
              setRequestStatus(requestData.status);
            }
            
            // Устанавливаем данные в Redux
            dispatch(setRequestData({
              max_volume: requestData.Max_volume,
              min_volume: requestData.Min_volume,
              calculationResult: requestData.Ratio,
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

  // Обновляем статус при изменении requestInfo (если в нем есть статус)
  useEffect(() => {
    if (requestInfo && requestInfo.status !== undefined) {
      setRequestStatus(requestInfo.status);
    }
  }, [requestInfo]);

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

  // Сохранение отдельной издержки
  const handleSaveCost = async (costId: number | undefined, costTitle: string) => {
    if (!costId || !id) return;
    
    setSavingCostIds(prev => new Set(prev).add(costId));
    
    try {
      // Находим издержку в массиве costs
      const cost = costs.find(c => c.cost_id === costId);
      if (cost) {
        await dispatch(
          updateCostInRequestAsync({
            requestId: Number(id),
            costId: costId,
            costPrice: cost.cost_price,
          }),
        ).unwrap();
        
        setNotification({
          message: `Издержка "${costTitle}" успешно сохранена!`,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Ошибка при сохранении издержки:", error);
      setNotification({
        message: `Ошибка при сохранении издержки "${costTitle}"`,
        type: "error",
      });
    } finally {
      setSavingCostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(costId);
        return newSet;
      });
    }
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
    <div className="page-index cost-request-page">
      <h1>Корзина заявки</h1>
      
      <div className="calculations centered-volume-section" style={{ marginBottom: '30px' }}>
        <div className="volume">
          <div className="volume-title" style={{ color: '#FDF1E0', marginBottom: '20px', textAlign: 'center' }}>
            Укажите объем выпуска:
          </div>
          <div className="volume-inputs-container">
            <div className="volume input">
              <span className="volume-label">1-й выпуск</span>
              <div className="input_volume">
                {isDraft ? (
                  <input
                    type="number"
                    value={minVolume}
                    onChange={handleMinVolumeChange}
                    min="1"
                    className="volume-input"
                  />
                ) : (
                  <div className="volume-display">
                    {minVolume}
                  </div>
                )}
              </div>
            </div>
            <div className="volume input">
              <span className="volume-label">2-й выпуск</span>
              <div className="input_volume">
                {isDraft ? (
                  <input
                    type="number"
                    value={maxVolume}
                    onChange={handleMaxVolumeChange}
                    min={minVolume + 1}
                    className="volume-input"
                  />
                ) : (
                  <div className="volume-display">
                    {maxVolume}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
       {/* Блок с коэффициентом показывается ТОЛЬКО при статусе 4 (Одобрена) */}
      {requestStatus === 4 && scaleRatio !== null && (
        <div className={`ratio-container ${scaleRatio > 1 ? 'ratio-positive' : 'ratio-negative'}`}>
          <div className="ratio-value">
            Коэффициент: <span>{scaleRatio}</span>
          </div>
          <div className="ratio-description">
            {scaleRatio > 1 ? 'Положительный эффект масштаба' : 'Отрицательный эффект масштаба'}
          </div>
        </div>
      )}
      </div>

      {/* Блок с коэффициентом показывается если заявка не одобрена*/}
      {requestStatus !== 4 && (
         <div className={"ratio-container"}>
          <div className="ratio-description">
              <div className="ratio-value">
                Коэффициент: <span>0</span>
                <p>Сформируйте заявку</p>
              </div>
            </div>
          </div>
      )}

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
          costs.map((requestItem, index) => {
            console.log('Rendering cost item:', requestItem);
            
            // Получаем данные карточки - используем поля из API ответа
            const costTitle = requestItem.cost_title || '';
            const costImage = requestItem.image_url || requestItem.image_url || '';
            const costId = requestItem.cost_id || index;
            const costPrice = requestItem.cost_price || 0;
            const isSavingCost = savingCostIds.has(costId);

            return (
              <div key={costId} className="request_conteiner">
                <div className="class center">
                  <div className="card1">
                    <h3>{costTitle}</h3>
                    {costImage && (
                      <img 
                        src={costImage} 
                        alt={costTitle}
                        style={{ 
                          width: '80%', 
                          height: '80%', 
                          marginTop: '3%', 
                          marginBottom: '5%' 
                        }}
                        onError={(e) => {
                          // Если изображение не загружается, скрываем его
                          (e.target as HTMLImageElement).style.display = 'none';
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
                            value={costPrice || ''}
                            onChange={(e) => handleCostPriceChange(requestItem.cost_id, e.target.value)}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              background: 'transparent',
                              textAlign: 'center',
                              fontSize: '25px',
                              color: '#000',
                              outline: 'none',
                            }}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '25px',
                            color: '#000',
                          }}>
                            {costPrice || "0.00"}
                          </div>
                        )}
                      </div>
                    </div>
                    {isDraft && (
                      <>
                        <button
                          className="card_button"
                          onClick={() => handleSaveCost(requestItem.cost_id, costTitle)}
                          disabled={isSavingCost}
                          style={{
                            backgroundColor: '#007bff',
                            color: '#FDF1E0',
                            borderColor: '#007bff',
                            height: '35px',
                            fontSize: '12px',
                            padding: '5px 10px',
                            marginRight: '10px',
                            marginTop: '5%',
                            minWidth: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSavingCost ? "Сохранение..." : "Сохранить"}
                        </button>
                        <img 
                          src={`${dest_root}/bin.png`}
                          style={{ 
                            height: '45px', 
                            width: '35px', 
                            cursor: 'pointer', 
                            marginTop: '5%' 
                          }} 
                          alt="Удалить"
                          onClick={() => handleDeleteCost(requestItem.cost_id)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Панель кнопок управления (только для черновиков) */}
      {isDraft && (
        <div className="request_button" style={{
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
        }}>
          <button
            className="card_button"
            onClick={handleRequestSave}
            disabled={isSaving}
            style={{
              backgroundColor: '#007bff',
              color: '#FDF1E0',
              borderColor: '#007bff',
              height: '40px',
              paddingLeft: '10px'
            }}
          >
            {isSaving ? "Сохранение..." : "Сохранить все"}
          </button>

          <button
            className="card_button"
            onClick={handleFormRequest}
            disabled={isSaving || isForming || hasChanges}
            style={{
              backgroundColor: '#28a745',
              color: '#FDF1E0',
              borderColor: '#28a745',
              height: '40px',
              width: '120px',
              paddingLeft: '5px'
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
              borderColor: '#dc3545',
              height: '40px'
            }}
          >
            Удалить
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

      {/* Глобальные стили для скрытия стрелочек у всех input type="number" */}
      <style>
        {`
          /* Скрываем стрелочки у полей ввода типа number во всем приложении */
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          input[type="number"] {
            -moz-appearance: textfield;
          }
          
          /* Для Firefox */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          /* Для Edge */
          input[type="number"]::-ms-clear {
            display: none;
          }
          
          /* Для всех браузеров */
          input[type="number"] {
            appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};
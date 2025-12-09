import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getCostByName, type Costs } from "../modules/ratioAPI";
import '../styles/global.css';
import { useSelector, useDispatch } from "react-redux"; // Добавляем Redux хуки
import type { RootState, AppDispatch } from "../store"; // Добавляем типы
import { addCostToRequest } from "../store/costRequestSlice"; // Предполагаем, что у вас есть такой экшен

export const CostsPage: React.FC = () => {
  const [costs, setCosts] = useState<Costs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Получаем состояние авторизации из Redux
  const isAuthorized = useSelector((state: RootState) => state.user.isAuthorized);
  
  // Получаем корзину из Redux
  const requestItems = useSelector((state: RootState) => state.costRequest.costs);
  const requestCount = requestItems?.length || 0;

  // Получаем параметр поиска из URL - ДОБАВЬТЕ ЭТО!
  const urlParams = new URLSearchParams(location.search);
  const queryFromUrl = urlParams.get('query') || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем список издержек
        const costData = await getCostByName(queryFromUrl);
        setCosts(costData.results);
        
        setSearchQuery(queryFromUrl);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryFromUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`?query=${encodeURIComponent(searchQuery)}`);
  };

   const handleAddToRequest = async (costId: number) => {
  try {
    // Проверяем авторизацию
    if (!isAuthorized) {
      navigate('/login');
      return;
    }
    
    // Диспатчим экшен добавления в корзину - передаем просто costId, а не объект
    dispatch(addCostToRequest(costId));
    console.log(`Издержка ${costId} добавлена в заявку`);
    
  } catch (err) {
    console.error("Ошибка добавления в заявку:", err);
    alert("Не удалось добавить в заявку");
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

  if (error) {
    return (
      <div className="page-index">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-index">
        {/* Счетчик заявок */}
      <div className="count_request req">
        Издержки
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          marginLeft: '10px'
        }}>
          <img 
            src="/DIA-Frontend/request_bin.png" 
            style={{ height: '30px', width: '30px' }} 
            alt="Корзина" 
          />
          {/* Отображаем счетчик для авторизованных пользователей */}
          {isAuthorized && requestCount > 0 && (
            <span style={{ 
              color: '#FDF1E0', 
              fontWeight: 'bold',
              fontSize: '16px',
              backgroundColor: '#145802',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '24px'
            }}>
              {requestCount}
            </span>
          )}
        </div>
      </div>
      
      {/* Форма поиска */}
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          name="query" 
          className="search field" 
          placeholder="Поиск..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search button">
          Найти
        </button>
      </form>

      {/* Список карточек */}
      <div className="cards_container">
        {costs.length > 0 ? (
          costs.map((cost) => (
            <div key={cost.id} className="class">
              <div className="card1">
                <h3>{cost.title}</h3>
                <img 
                  src={cost.image_url} 
                  alt={cost.title}
                  style={{ 
                    width: '80%', 
                    height: '80%', 
                    marginTop: '3%', 
                    marginBottom: '5%' 
                  }}
                />
              </div>
              <Link 
                to={`/costs/${cost.id}`} 
                className="card_button"
              >
                Подробнее
              </Link>
                {/* Кнопка "Добавить" - только для авторизованных */}
                {isAuthorized && (
                  <button 
                    className="card_button"
                    onClick={() => handleAddToRequest(cost.id)}
                    style={{ width: '100px' }}
                  >
                    Добавить
                  </button>
                )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};
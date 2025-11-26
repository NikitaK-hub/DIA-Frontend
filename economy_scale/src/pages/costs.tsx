import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCosts, setSearchValue } from "../store/costsSlice";
import { dest_root } from "../modules/target_config";
import { getCostByName } from "../modules/ratioAPI";

export const CostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchValue, costs } = useAppSelector(
    (state) => state.costsFilter
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Получаем параметр поиска из URL
    const urlParams = new URLSearchParams(location.search);
    const queryFromUrl = urlParams.get('query') || "";
    // Синхронизируем searchValue с URL при загрузке
    if (queryFromUrl && queryFromUrl !== searchValue) {
      dispatch(setSearchValue(queryFromUrl));
    }
    if (costs.length === 0) {
      loadCosts();
    }
  }, []);

  const loadCosts = async () => {
    setLoading(true);
    const searchName = searchValue.trim();
    try {
      const costs = await getCostByName(searchName);
      dispatch(setCosts(costs.results));
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    location.search = `?query=${encodeURIComponent(searchValue)}`;
    loadCosts();
  };

  const handleCardClick = (id: number) => {
    navigate(`/costs/${id}`);
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

  return (
    <div className="page-index">
      {/* Счетчик заявок */}
      <div className="count_request req">
        Издержки
        <img
          src={`${dest_root}/public/request_bin.png`}
          style={{ height: '30px', width: '30px' }}
          alt="Корзина"
        />
      </div>

      {/* Форма поиска */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="query"
          className="search field"
          placeholder="Поиск..."
          value={searchValue}
          onChange={(e) => dispatch(setSearchValue(e.target.value))}
        />
        <button type="submit" className="search button">
          Найти
        </button>
      </form>

      {/* Список карточек */}
      <div className="cards_container">
        {costs && costs.length > 0 ? (
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
                onClick={() => handleCardClick(cost.id)}
              >
                Подробнее
              </Link>
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

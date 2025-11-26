import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCostByID, type Costs } from "../modules/ratioAPI";

export const CostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cost, setCost] = useState<Costs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCost = async () => {
      if (!id) {
        setError("ID издержки не указан");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const costId = parseInt(id);
        const costData = await getCostByID(costId);

        if (costData) {
          setCost(costData);
        } else {
          setError("Издержка не найдена");
        }
      } catch (err) {
        console.error("Ошибка загрузки Издержки:", err);
        setError("Не удалось загрузить информацию об издержке");
      } finally {
        setLoading(false);
      }
    };

    fetchCost();
  }, [id]);

  if (loading) {
    return (
      <div className="page-cost">
        <div className="loadingBg">
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-cost">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!cost) {
    return (
      <div className="page-cost">
        <div className="error-message">
          <h2>Издержка не найдена</h2>
          <p>Запрашиваемой издержки не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cost">
      <div className="class">
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
      </div>
      <div className="class cost_info">
        {cost.info}
      </div>
    </div>
  );
};
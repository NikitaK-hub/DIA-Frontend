import type { FC } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { getCostRequestInfo } from "../modules/ratioAPI";
import type { CostRequestInfo } from "../modules/ratioAPI";
import { dest_root } from "../modules/target_config";

export const RequestBin: FC = () => {
  const [costRequestInfo, setCostRequestInfo] =
    useState<CostRequestInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCostRequestInfo = async () => {
      try {
        setLoading(true);
        const info = await getCostRequestInfo();
        setCostRequestInfo(info);
      } catch (error) {
        console.error("Error fetching cost request info:", error);
        setCostRequestInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCostRequestInfo();
  }, []);

  const isDisabled = !costRequestInfo || costRequestInfo.item_count < 1;

  if (loading) {
    return (
      <div className="request-bin request-bin-loading">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <Link
      className={`request-bin ${isDisabled ? "request_bin--disabled" : ""}`}
      to={isDisabled ? "#" : `/cost-request/${costRequestInfo?.request_id}`}
      onClick={(e) => isDisabled && e.preventDefault()}
    >
      <img
        className="cost-request-button"
        src={`${dest_root}/request_bin.png`}
        alt="Request Bin"
      />
      {costRequestInfo && costRequestInfo.item_count > 0 && (
        <span className="request-bin-items">{costRequestInfo.item_count}</span>
      )}
    </Link>
  );
};
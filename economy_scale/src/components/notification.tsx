import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
  id?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    if (duration > 0) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for fade-out animation
        }
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }

    return () => clearTimeout(showTimer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for fade-out animation
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`notification notification-${type} ${isVisible ? "notification-show" : "notification-hide"}`}
    >
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

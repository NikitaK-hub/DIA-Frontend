import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { ROUTES } from "../components/routes";
import { updateProfileAsync } from "../store/userSlice";

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const error = useSelector((state: RootState) => state.user.error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) {
      setValidationError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = (): boolean => {
    if (isEditing) {
      if (!formData.currentPassword) {
        setValidationError("Текущий пароль обязателен для изменения данных");
        return false;
      }

      if (formData.newPassword && formData.newPassword.length < 6) {
        setValidationError("Новый пароль должен содержать минимум 6 символов");
        return false;
      }

      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        setValidationError("Новые пароли не совпадают");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData: {
        username?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        currentPassword: formData.currentPassword,
      };

      if (formData.username !== currentUser.username) {
        updateData.username = formData.username;
      }

      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      const result = await dispatch(updateProfileAsync(updateData));

      if (updateProfileAsync.fulfilled.match(result)) {
        setSuccessMessage("Профиль успешно обновлен");
        setIsEditing(false);

        // Сбросить поля паролей
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Автоматически скрыть сообщение об успехе через 3 секунды
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setValidationError("Ошибка при обновлении профиля");
      }
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      setValidationError("Ошибка при обновлении профиля");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: currentUser.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setValidationError("");
    setSuccessMessage("");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Card className="profile-card">
          <Card.Body>
            <Card.Title className="profile-title">
              Профиль пользователя
            </Card.Title>

            {(error || validationError) && (
              <Alert variant="danger" className="profile-alert">
                {validationError || error || "Ошибка при обновлении профиля"}
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" className="profile-alert">
                {successMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="profile-form">
              <Form.Group controlId="username" className="form-group">
                <Form.Label>Имя пользователя</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                  disabled={!isEditing}
                  required
                />
              </Form.Group>

              {isEditing && (
                <>
                  <Form.Group
                    controlId="currentPassword"
                    className="form-group"
                  >
                    <Form.Label>Текущий пароль</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Введите текущий пароль"
                      required
                    />
                    <Form.Text className="text-muted">
                      Требуется для подтверждения изменений
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="newPassword" className="form-group">
                    <Form.Label>Новый пароль</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Введите новый пароль (оставьте пустым, если не хотите менять)"
                    />
                    <Form.Text className="text-muted">
                      Минимум 6 символов
                    </Form.Text>
                  </Form.Group>

                  <Form.Group
                    controlId="confirmPassword"
                    className="form-group"
                  >
                    <Form.Label>Подтвердите новый пароль</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Повторите новый пароль"
                    />
                  </Form.Group>
                </>
              )}

              <div className="profile-actions">
                {!isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      className="profile-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Редактировать профиль
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="profile-btn"
                      onClick={() => navigate(ROUTES.COSTS)}
                    >
                      Назад к издержкам
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      type="submit"
                      className="profile-btn"
                    >
                      Сохранить изменения
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="profile-btn"
                      onClick={handleCancel}
                    >
                      Отмена
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
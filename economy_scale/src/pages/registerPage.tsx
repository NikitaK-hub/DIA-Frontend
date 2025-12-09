import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUserAsync } from "../store/userSlice";
import { ROUTES } from "../components/routes";
import { Form, Button, Alert } from "react-bootstrap";

export const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string>("");
  const error = useSelector((state: RootState) => state.user.error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setValidationError("Имя пользователя обязательно");
      return false;
    }

    if (!formData.password) {
      setValidationError("Пароль обязателен");
      return false;
    }

    if (formData.password.length < 6) {
      setValidationError("Пароль должен содержать минимум 6 символов");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registrationData } = formData;

    if (registrationData.username && registrationData.password) {
      const result = await dispatch(registerUserAsync(registrationData));

      if (registerUserAsync.fulfilled.match(result)) {
        navigate(ROUTES.COSTS);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Добро пожаловать!</h2>
        <p className="login-footer-text">Создайте новый аккаунт</p>

        {(error || validationError) && (
          <Alert variant="danger" className="login-alert">
            {validationError || "Ошибка при регистрации. Попробуйте еще раз."}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group controlId="username" className="form-group">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите имя пользователя"
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="form-group">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль (минимум 6 символов)"
              required
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="form-group">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="login-btn-submit">
            Зарегистрироваться
          </Button>

          <div className="login-footer">
            <p className="login-footer-text">
              Уже есть аккаунт?{" "}
              <Link to={ROUTES.LOGIN} className="login-footer-link">
                Войти
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUserAsync } from "../store/userSlice";
import { ROUTES } from "../components/routes";
import { Form, Button, Alert } from "react-bootstrap";

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const error = useSelector((state: RootState) => state.user.error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      const result = await dispatch(loginUserAsync(formData));

      if (loginUserAsync.fulfilled.match(result)) {
        navigate(ROUTES.COSTS);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Рады снова Вас видеть!</h2>
        {error && (
          <Alert variant="danger" className="login-alert">
            Введены неверные данные
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
            />
          </Form.Group>
          <Form.Group controlId="password" className="form-group">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="login-btn-submit">
            Войти
            
          </Button>
           <div className="login-footer">
            <p className="login-footer-text">
              Нет аккаунта?{" "}
              <Link to={ROUTES.REGISTER} className="login-footer-link">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

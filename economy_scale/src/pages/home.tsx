import type { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container className="home-page">
      <Row className="justify-content-center text-center mb-4">
        <Col lg={8}>
          <h1 className="display-5 mb-3">Расчет экономии от масштаба</h1>
          <p className="text-muted">
            Инструмент для расчета экономии от масштаба производства
          </p>
        </Col>
      </Row>
    </Container>
  );
};
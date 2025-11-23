import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../components/routes";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

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

      <Row className="justify-content-center mb-4">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Card.Title className="h5 mb-3">Издержки</Card.Title>
              <Card.Text className="mb-3">
                Просмотрите все издержки и оцените их стоимость в зависимости от масштаба производства.
              </Card.Text>
              <Link to={ROUTES.STAGES}>
              <Button 
                className="costs_button"
              >
                Перейти к издержкам
              </Button>
                {/* <Button style={{color: '#000', backgroundColor: '#F4E5CF', height: '22px', width: '150px', cursor: 'pointer',}}>
                  
                </Button> */}
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

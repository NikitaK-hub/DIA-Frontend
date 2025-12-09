import type { FC } from "react";
import { Container, Row, Col, Carousel } from "react-bootstrap";

export const HomePage: FC = () => {
  return (
    <Container className="home-page">

      {/* Карусель в центре - виден только 1 пункт */}
      <Row className="justify-content-center mb-5">
        <Col lg={8}>
          <Carousel 
            className="centered-carousel" 
            indicators={true}
            prevIcon={<span className="carousel-arrow">‹</span>}
            nextIcon={<span className="carousel-arrow">›</span>}
            interval={null} // Отключаем автопереключение
          >
            <Carousel.Item>
              <div className="carousel-item-content">
                <h3 className="carousel-title">Что такое экономия от масштаба?</h3>
                <p className="carousel-text">
                  Экономия от масштаба - это снижение средних издержек производства 
                  по мере увеличения объема выпускаемой продукции.
                </p>
              </div>
            </Carousel.Item>
            
            <Carousel.Item>
              <div className="carousel-item-content">
                <h3 className="carousel-title">Как это работает?</h3>
                <p className="carousel-text">
                  1. Добавляйте различные виды издержек производства<br />
                  2. Анализируйте зависимость издержек от объемов выпуска<br />
                  3. Рассчитывайте оптимальные объемы производства
                </p>
              </div>
            </Carousel.Item>
            
            <Carousel.Item>
              <div className="carousel-item-content">
                <h3 className="carousel-title">Преимущества сервиса</h3>
                <p className="carousel-text">
                  • Учет различных типов издержек<br />
                  • Расчет точки безубыточности<br />
                  • Анализ эффективности масштабирования
                </p>
              </div>
            </Carousel.Item>
            
            <Carousel.Item>
              <div className="carousel-item-content">
                <h3 className="carousel-title">Для кого этот сервис?</h3>
                <p className="carousel-text">
                  • Производственные предприятия<br />
                  • Экономисты и аналитики<br />
                  • Студенты экономических специальностей<br />
                  • Предприниматели
                </p>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};
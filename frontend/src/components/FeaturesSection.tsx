import { useState, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const featuresPerPage = 6;

  const nextSlide = () => {
    setCurrentIndex(prev => 
      Math.min(prev + 1, Math.ceil(features.length / featuresPerPage) - 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const visibleFeatures = features.slice(
    currentIndex * featuresPerPage,
    (currentIndex + 1) * featuresPerPage
  );

  return (
    <section id="features" className="py-5 bg-white position-relative">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="display-5 fw-bold mb-3">Powerful Features</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Everything you need to build professional data-rich applications with React
          </p>
        </motion.div>

        <div className="position-relative">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="btn btn-icon btn-primary position-absolute start-0 top-50 translate-middle-y z-3 d-none d-md-flex"
              style={{ left: '-40px' }}
            >
              <FiChevronLeft size={24} />
            </button>
          )}

          {/* Features Carousel */}
          <div ref={containerRef} className="overflow-hidden">
            <Row className="g-4 flex-nowrap" style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease'
            }}>
              {features.map((feature, index) => (
                <Col md={6} lg={4} xl={3} key={index} className="flex-shrink-0" style={{ width: '33.333%' }}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={variants}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                          {feature.icon}
                        </div>
                        <h3 className="h4 fw-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted mb-0">{feature.description}</p>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Right Arrow */}
          {currentIndex < Math.ceil(features.length / featuresPerPage) - 1 && (
            <button
              onClick={nextSlide}
              className="btn btn-icon btn-primary position-absolute end-0 top-50 translate-middle-y z-3 d-none d-md-flex"
              style={{ right: '-40px' }}
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="d-flex justify-content-center mt-4">
          {Array.from({ length: Math.ceil(features.length / featuresPerPage) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`btn btn-xs rounded-circle mx-1 ${currentIndex === i ? 'bg-primary' : 'bg-secondary bg-opacity-25'}`}
              style={{ width: '10px', height: '10px' }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
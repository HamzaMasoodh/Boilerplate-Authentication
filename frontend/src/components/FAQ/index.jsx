// FAQSection.jsx
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';

const FAQSection = () => {
  return (
    <section id="faq" className="faq">
      <div className="container" data-aos="fade-up">
        <div className="section-header">
          <span>Frequently Asked Questions</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="200">
          <div className="col-lg-10">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                <Accordion.Body>
                  Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                <Accordion.Body>
                  Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                <Accordion.Body>
                  Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                <Accordion.Body>
                  Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

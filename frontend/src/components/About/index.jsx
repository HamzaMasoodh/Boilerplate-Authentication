import React, { useEffect } from 'react';
import AOS from 'aos';
import GLightbox from 'glightbox';
import 'aos/dist/aos.css'; // AOS styles
import 'glightbox/dist/css/glightbox.min.css'; // GLightbox styles
import aboutImage from '../../assets/img/about.jpg';

const About = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      once: true, // Animation only occurs once
      delay: 100, // Delay in milliseconds.
      duration: 700, // Animation duration in milliseconds.
    });

    // Initialize GLightbox
    const lightbox = GLightbox({
      selector: '.glightbox' // This can be any selector you want
    });

    // Cleanup GLightbox when the component unmounts
    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <section id="about" className="about pt-0">
      <div className="container" data-aos="fade-up">

        <div className="row gy-4">
          <div className="col-lg-6 position-relative align-self-start order-lg-last order-first">
            <img src={aboutImage} className="img-fluid" alt="About Us" />
            <a href="https://www.youtube.com/watch?v=LXb3EKWsInQ" className="glightbox play-btn"></a>
          </div>
          <div className="col-lg-6 content order-last order-lg-first">
            <h3>About Us</h3>
            <p>
              Dolor iure expedita id fuga asperiores qui sunt consequatur minima. Quidem voluptas deleniti. Sit quia molestiae quia quas qui magnam itaque veritatis dolores. Corrupti totam ut eius incidunt reiciendis veritatis asperiores placeat.
            </p>
            <ul>
              <li data-aos="fade-up" data-aos-delay="100">
                <i className="bi bi-diagram-3"></i>
                <div>
                  <h5>Ullamco laboris nisi ut aliquip consequat</h5>
                  <p>Magni facilis facilis repellendus cum excepturi quaerat praesentium libre trade</p>
                </div>
              </li>
              <li data-aos="fade-up" data-aos-delay="200">
                <i className="bi bi-fullscreen-exit"></i>
                <div>
                  <h5>Magnam soluta odio exercitationem reprehenderi</h5>
                  <p>Quo totam dolorum at pariatur aut distinctio dolorum laudantium illo direna pasata redi</p>
                </div>
              </li>
              <li data-aos="fade-up" data-aos-delay="300">
                <i className="bi bi-broadcast"></i>
                <div>
                  <h5>Voluptatem et qui exercitationem</h5>
                  <p>Et velit et eos maiores est tempora et quos dolorem autem tempora incidunt maxime veniam</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;

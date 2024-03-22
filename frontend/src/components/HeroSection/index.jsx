import heroImage from '../../assets/img/hero-img.svg'
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  // State to store the counter values
  const [counters, setCounters] = useState({
    clients: 0,
    projects: 0,
    support: 0,
    workers: 0
  });

  useEffect(() => {
    AOS.init({ once: true });

    // Functions to start counting animation
    const startCounting = (key, end, duration) => {
      let start = 0;
      // Determine the time interval for the counter
      const interval = duration / end;
      const counter = setInterval(() => {
        start += 1;
        setCounters((prevCounters) => ({ ...prevCounters, [key]: start }));
        if (start === end) clearInterval(counter);
      }, interval);
    };

    startCounting('clients', 232, 1000);
    startCounting('projects', 521, 1000);
    startCounting('support', 780, 1000);
    startCounting('workers', 32, 1000);

  }, []);

  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container">
      <div className="container">
      <div className="row gy-4 d-flex justify-content-between">
        <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
          <h2 data-aos="fade-up">Relocate with a Premier Moving Service</h2>
          <p data-aos="fade-up" data-aos-delay="100">Get estimates from up to 6 reputable movers and enjoy savings</p>

          <form action="#" className="form-search d-flex align-items-stretch mb-3" data-aos="fade-up" data-aos-delay="200">
            <input type="text" className="form-control" placeholder="ZIP code or CitY"/>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="row gy-4" data-aos="fade-up" data-aos-delay="400">

            <div className="col-lg-3 col-6">
              <div className="stats-item text-center w-100 h-100">
                <span className="purecounter">{counters.clients}</span>
                <p>Clients</p>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="stats-item text-center w-100 h-100">
                <span className="purecounter">{counters.projects}</span>
                <p>Projects</p>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="stats-item text-center w-100 h-100">
                <span className="purecounter">{counters.support}</span>
                <p>Support</p>
              </div>
            </div>

            <div className="col-lg-3 col-6">
              <div className="stats-item text-center w-100 h-100">
                <span className="purecounter">{counters.workers}</span>
                <p>Workers</p>
              </div>
            </div>

          </div>
        </div>

        <div className="col-lg-5 order-1 order-lg-2 hero-img" data-aos="zoom-out">
          <img src={heroImage} className="img-fluid mb-3 mb-lg-0" alt=""/>
        </div>

      </div>
    </div>
      </div>
    </section>
    
  );
};

export default HeroSection;

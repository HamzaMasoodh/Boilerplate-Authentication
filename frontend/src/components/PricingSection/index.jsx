import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from "react-router-dom";


const PricingSection = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section id="pricing" className="pricing pt-0">
      <div className="container" data-aos="fade-up">
      <div className="section-header">
          <span>Pricing</span>
          <h2>Pricing</h2>

        </div>

        <div className="row gy-4">

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div className="pricing-item">
              <h3>Free Plan</h3>
              <h4><sup>$</sup>0<span> / month</span></h4>
              <ul>
                <li><i className="bi bi-check"></i> Quam adipiscing vitae proin</li>
                <li><i className="bi bi-check"></i> Nec feugiat nisl pretium</li>
                <li><i className="bi bi-check"></i> Nulla at volutpat diam uteera</li>
                <li className="na"><i className="bi bi-x"></i> <span>Pharetra massa massa ultricies</span></li>
                <li className="na"><i className="bi bi-x"></i> <span>Massa ultricies mi quis hendrerit</span></li>
              </ul>
              <Link to="#" className="buy-btn">Buy Now</Link>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div className="pricing-item featured">
              <h3>Business Plan</h3>
              <h4><sup>$</sup>29<span> / month</span></h4>
              <ul>
                <li><i className="bi bi-check"></i> Quam adipiscing vitae proin</li>
                <li><i className="bi bi-check"></i> Nec feugiat nisl pretium</li>
                <li><i className="bi bi-check"></i> Nulla at volutpat diam uteera</li>
                <li><i className="bi bi-check"></i> Pharetra massa massa ultricies</li>
                <li><i className="bi bi-check"></i> Massa ultricies mi quis hendrerit</li>
              </ul>
              <Link to="#" className="buy-btn">Buy Now</Link>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
            <div className="pricing-item">
              <h3>Developer Plan</h3>
              <h4><sup>$</sup>49<span> / month</span></h4>
              <ul>
                <li><i className="bi bi-check"></i> Quam adipiscing vitae proin</li>
                <li><i className="bi bi-check"></i> Nec feugiat nisl pretium</li>
                <li><i className="bi bi-check"></i> Nulla at volutpat diam uteera</li>
                <li><i className="bi bi-check"></i> Pharetra massa massa ultricies</li>
                <li><i className="bi bi-check"></i> Massa ultricies mi quis hendrerit</li>
              </ul>
              <Link to="#" className="buy-btn">Buy Now</Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PricingSection;
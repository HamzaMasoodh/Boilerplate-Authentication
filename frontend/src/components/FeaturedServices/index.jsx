// FeaturedServices.jsx
import React from 'react';
import { Link } from "react-router-dom";

const FeaturedServices = () => {
  return (
    <section id="featured-services" className="featured-services">
      <div className="container">
      <div className="row gy-4">

<div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up">
  <div className="icon flex-shrink-0"><i className="fa-solid fa-cart-flatbed"></i></div>
  <div>
    <h4 className="title">Lorem Ipsum</h4>
    <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
    <Link to="service-details" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></Link>
  </div>
</div>


<div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="100">
  <div className="icon flex-shrink-0"><i className="fa-solid fa-truck"></i></div>
  <div>
    <h4 className="title">Dolor Sitema</h4>
    <p className="description">Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata</p>
    <Link to="service-details" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></Link>
  </div>
</div>

<div className="col-lg-4 col-md-6 service-item d-flex" data-aos="fade-up" data-aos-delay="200">
  <div className="icon flex-shrink-0"><i className="fa-solid fa-truck-ramp-box"></i></div>
  <div>
    <h4 className="title">Sed ut perspiciatis</h4>
    <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
    <Link to="service-details" className="readmore stretched-link"><span>Learn More</span><i className="bi bi-arrow-right"></i></Link>
  </div>
</div>

</div>
      </div>
    </section>
  );
};

export default FeaturedServices;

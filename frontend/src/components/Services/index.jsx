// Services.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import storageImage from '../../assets/img/storage-service.jpg';
import FindBestMoveticsImage from '../../assets/img/FindBestMovetics-service.jpg';
import cargoImage from '../../assets/img/cargo-service.jpg';
import truckingImage from '../../assets/img/trucking-service.jpg';
import packagingImage from '../../assets/img/packaging-service.jpg';
import warehousingImage from '../../assets/img/warehousing-service.jpg';
import { Link } from "react-router-dom";



const Services = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section id="service" className="services pt-0">
      <div className="container" data-aos="fade-up">
    
        <div className="section-header">
          <span>Our Services</span>
          <h2>Our Services</h2>

        </div>

        <div className="row gy-4">

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div className="card">
              <div className="card-img">
                <img src={storageImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">Storage</Link></h3>
              <p>Cumque eos in qui numquam. Aut aspernatur perferendis sed atque quia voluptas quisquam repellendus temporibus itaqueofficiis odit</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="card">
              <div className="card-img">
                <img src={FindBestMoveticsImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">FindBestMovetics</Link></h3>
              <p>Asperiores provident dolor accusamus pariatur dolore nam id audantium ut et iure incidunt molestiae dolor ipsam ducimus occaecati nisi</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="card">
              <div className="card-img">
                <img src={cargoImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">Cargo</Link></h3>
              <p>Dicta quam similique quia architecto eos nisi aut ratione aut ipsum reiciendis sit doloremque oluptatem aut et molestiae ut et nihil</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="card">
              <div className="card-img">
                <img src={truckingImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">Trucking</Link></h3>
              <p>Dicta quam similique quia architecto eos nisi aut ratione aut ipsum reiciendis sit doloremque oluptatem aut et molestiae ut et nihil</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
            <div className="card">
              <div className="card-img">
                <img src={packagingImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">Packaging</Link></h3>
              <p>Illo consequuntur quisquam delectus praesentium modi dignissimos facere vel cum onsequuntur maiores beatae consequatur magni voluptates</p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
            <div className="card">
              <div className="card-img">
                <img src={warehousingImage} alt="" className="img-fluid"/>
              </div>
              <h3><Link to="service-details.html" className="stretched-link">Warehousing</Link></h3>
              <p>Quas assumenda non occaecati molestiae. In aut earum sed natus eatae in vero. Ab modi quisquam aut nostrum unde et qui est non quo nulla</p>
            </div>
          </div>

        </div>

      </div>
    </section>

  );
};

export default Services;

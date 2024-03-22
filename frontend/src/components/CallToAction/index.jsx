import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CallToAction = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section id="call-to-action" className="call-to-action">
      <div className="container" data-aos="zoom-out">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h3>Call To Action</h3>
            <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...</p>
            {/* If you have a route for the call to action, use Link from react-router-dom */}
            <a className="cta-btn" href="#">Call To Action</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

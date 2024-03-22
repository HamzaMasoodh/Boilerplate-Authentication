import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedServices from "../components/FeaturedServices";
import About from "../components/About";
import Services from "../components/Services";
import CallToAction from "../components/CallToAction";
import Features from "../components/Features";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQ";

const Home = () => {
  return (
    <>
      <HeroSection/>
      <main id="main"/>
      <FeaturedServices/>
      <About/>
      <Services/>
      <CallToAction/>
      <Features/>
      <PricingSection/>
      <TestimonialsSection/>
      <FAQSection/>
    </>
  );
};

export default Home;
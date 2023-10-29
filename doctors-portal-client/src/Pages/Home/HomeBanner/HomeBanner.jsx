import React from "react";
import chair from "../../../assets/images/chair.png";
const HomeBanner = () => {
  return (
    <div className="hero my-12">
      <div className="hero-content flex-col-reverse lg:flex-row">
        <div>
          <h1 className="text-5xl font-bold">Your New Smile Starts Here</h1>
          <p className="py-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry`s standard dummy text
            ever since the
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
        <img src={chair} className="lg:w-1/2 rounded-lg shadow-2xl" />
      </div>
    </div>
  );
};

export default HomeBanner;

import React from "react";
import appointment from "../../../assets/images/appointment.png";
const ContactUs = () => {
  return (
    <div
      style={{
        background: `url(${appointment})`,
      }}
      className="grid grid-cols-1 place-items-center">
      <div className="my-16 text-center">
        <p className="text-xl text-primary">Contact us</p>
        <p className="text-4xl text-white mt-3 mb-10">Stay connected with us</p>
        <form className="my-4 flex flex-col items-center  lg:w-96">
          <input
            className="input mt-5 input-bordered text-xl w-full"
            placeholder="Email address"
            type="text"
          />
          <input
            className="input mt-5 input-bordered text-xl w-full"
            placeholder="Subject"
            type="text"
          />
          <textarea
            className="textarea mt-5 textarea-bordered w-full text-xl"
            rows={4}
            placeholder="Your massage"
            type="text"
          />
          <input
            type="button"
            className="btn mt-12 btn-primary w-1/3"
            value="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default ContactUs;

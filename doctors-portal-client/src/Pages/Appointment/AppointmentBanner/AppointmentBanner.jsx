import React, { useState } from "react";
import bg from "../../../assets/images/bg.png";
import chair from "../../../assets/images/chair.png";
import { DayPicker } from "react-day-picker";
const AppointmentBanner = ({ selectedDate, setSelectedDate }) => {
  return (
    <div
      style={{
        background: `url(${bg})`,
      }}>
      <div className="hero my-12">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={chair} className="lg:w-1/2 rounded-lg " />
          <div className="mr-6 sm:w-full">
            <DayPicker
              mode="single"
              showOutsideDays
              disabled={{ before: new Date() }}
              selected={selectedDate}
              onDayClick={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBanner;

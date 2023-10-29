import { format } from "date-fns";
import React, { useState } from "react";
import BookingModal from "../BookingModal/BookingModal";
import AppointmentOptions from "./AppointmentOptions";

const AvailableAppointments = ({ selectedDate, appointmentOptions,refetch }) => {
  const [treatmentDetails, setTreatmentDetails] = useState([]);
  return (
    <div className="text-center my-12">
      <p className="text-xl text-primary">
        Available Services on {format(selectedDate, "PP")}
      </p>
      <p className="text-xl">Please select a service.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {appointmentOptions.data &&
          appointmentOptions?.data.map((appointmentOption, i) => (
            <AppointmentOptions
              key={i}
              appointmentOption={appointmentOption}
              setTreatmentDetails={setTreatmentDetails}></AppointmentOptions>
          ))}
      </div>
      {treatmentDetails && (
        <BookingModal
          treatmentDetails={treatmentDetails}
          setTreatmentDetails={setTreatmentDetails}
          selectedDate={selectedDate}
          refetch={refetch}></BookingModal>
      )}
    </div>
  );
};

export default AvailableAppointments;

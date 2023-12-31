import React, { useState } from "react";
import AppointmentBanner from "./AppointmentBanner/AppointmentBanner";
import { format } from "date-fns";
import AvailableAppointments from "./AvailableAppointments/AvailableAppointments";
import { useQuery } from "react-query";
import Loading from "../../Components/Loading/Loading";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const Appointment = () => {
  const [axiosSecure] = useAxiosSecure();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const date = format(selectedDate, "PP");
  const {
    data: appointmentOptions = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["appointmentOptions", date],
    queryFn: () =>
      axiosSecure.get(`/appointmentOptions?date=${date}`).then((res) => {
        return res.data.data;
      }),
  });
  // console.log(appointmentOptions);
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <AppointmentBanner
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}></AppointmentBanner>
      <AvailableAppointments
        selectedDate={selectedDate}
        appointmentOptions={appointmentOptions}
        refetch={refetch}
        setSelectedDate={setSelectedDate}></AvailableAppointments>
    </>
  );
};

export default Appointment;

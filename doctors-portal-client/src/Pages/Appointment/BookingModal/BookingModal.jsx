import { format } from "date-fns";
import React, { useContext } from "react";
import { AuthContext } from "../../../Contexts/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BookingModal = ({
  treatmentDetails,
  setTreatmentDetails,
  selectedDate,
  refetch,
}) => {
  const [axiosSecure] = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { name: treatmentName, slots, price } = treatmentDetails;
  const date = format(selectedDate, "PP");
  const handleBooking = (event) => {
    event.preventDefault();
    const form = event.target;
    const slot = form.slot.value;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const bookingDetails = {
      patientName: name,
      patientEmail: email,
      bookedTreatment: treatmentName,
      appointmentDate: date,
      bookedSlot: slot,
      phone,
      price,
    };
    //putting bookingDetails to mongo database

    axiosSecure
      .post("/bookings", bookingDetails)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.data.acknowledged) {
          toast.success("Booked successfully");
          refetch();
          setTreatmentDetails("");
        } else {
          // console.log(res.data.data);
          toast.error(res.data.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <input type="checkbox" id="booking-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="booking-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          <h3 className="text-lg font-bold">{treatmentName}</h3>
          <form
            onSubmit={handleBooking}
            className="grid grid-cols-1 gap-3 mt-10">
            <input
              type="text"
              disabled
              value={date}
              className="input w-full input-bordered "
            />
            <select name="slot" className="select select-bordered w-full">
              {slots?.map((slot, i) => (
                <option value={slot} key={i}>
                  {slot}
                </option>
              ))}
            </select>
            <input
              name="name"
              type="text"
              defaultValue={user?.displayName}
              disabled
              placeholder="Your Name"
              className="input w-full input-bordered"
            />
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              disabled
              placeholder="Email Address"
              className="input w-full input-bordered"
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              className="input w-full input-bordered"
            />
            <br />
            <input
              className="btn btn-accent w-full"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

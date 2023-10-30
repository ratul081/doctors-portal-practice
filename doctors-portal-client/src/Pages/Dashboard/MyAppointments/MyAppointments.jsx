import React, { useContext } from "react";
import { useQuery } from "react-query";
import { AuthContext } from "../../../Contexts/AuthProvider";
import axios from "axios";
import Loading from "../../../Components/Loading/Loading";
import toast from "react-hot-toast";

const MyAppointment = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const {
    data: myAppointments = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myAppointment", email],
    queryFn: () =>
      axios.get(`http://localhost:5000/bookings?email=${email}`).then((res) => {
        return res.data;
      }),
  });
  // console.log(myAppointments.data);
  const handleDeleteAppointments = (id) => {
    axios
      .delete(`http://localhost:5000/bookings/${id}`, { data: { email } })
      .then((res) => {
        if (res.data.acknowledged) {
          toast.success("Deleted Successfully");
          refetch();
        }
      });
  };

  const today = new Date().toUTCString().slice(5, 16);
  return (
    <div>
      <div className="text-2xl my-5 flex font-semibold justify-between">
        <p>My appointment</p>
        <div className="btn text-xl btn-outline">{today}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="table text-xl table-zebra">
          {/* head */}
          <thead>
            <tr className="text-lg">
              <th></th>
              <th>Treatment</th>
              <th>Time</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            {/* row 1 */}
            {isLoading && (
              <tr>
                <th></th>
                <th></th>
                <th>
                  <Loading></Loading>
                </th>
              </tr>
            )}
            {myAppointments?.data &&
              myAppointments?.data.map((myAppointment, i) => (
                <tr key={myAppointment?._id}>
                  <th>{i + 1}</th>
                  <td>{myAppointment?.bookedTreatment}</td>
                  <td>{myAppointment?.bookedSlot}</td>
                  <td>{myAppointment?.appointmentDate}</td>
                  <td>
                    <button className="btn btn-secondary mx-2 text-white font-bold normal-case">
                      Pay
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteAppointments(myAppointment?._id)
                      }
                      className="btn btn-secondary mx-2 text-white font-bold normal-case">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointment;

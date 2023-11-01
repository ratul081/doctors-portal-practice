import React from "react";
import { useQuery } from "react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const ManageDoctors = () => {
  const [axiosSecure] = useAxiosSecure();
  const {
    data: doctors = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () =>
      await axiosSecure.get("/doctors").then((res) => {
        return res.data.data;
      }),
  });
  // console.log(doctors);
  const handleDeleteDoctor = (id) => {
    axiosSecure.delete(`/doctors/${id}`, { data: { id } }).then((res) => {
      console.log(res.data);
      if (res.data.data.acknowledged) {
        toast.success("Deleted Successfully");
        refetch();
      }
    });
  };
  return (
    <div className="overflow-x-auto">
      <table className="table text-xl">
        <thead className="text-lg">
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialty</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="font-semibold">
          {isLoading && (
            <tr>
              <th></th>
              <th></th>
              <th>
                <Loading></Loading>
              </th>
            </tr>
          )}
          {doctors &&
            doctors.map((doctor, i) => (
              <tr key={doctor?._id}>
                <th>{i + 1}</th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={doctor?.doctors_image}
                          alt={doctor?.doctors_name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{doctor?.doctors_name}</div>
                    </div>
                  </div>
                </td>
                <td>{doctor?.doctors_email}</td>
                <td>{doctor?.doctors_specialty}</td>
                <th>
                  <button
                    onClick={() => handleDeleteDoctor(doctor?._id)}
                    className="btn btn-error btn-xs">
                    Delete
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDoctors;

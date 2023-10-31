import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllUsers = () => {
  const [axiosSecure] = useAxiosSecure();
  const { data: allUsers = [], refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      axiosSecure.get("/allUsers").then((res) => {
        return res.data.data;
      }),
  });
  // console.log(allUsers);

  const handleMakeAdmin = (user) => {
    axiosSecure.patch(`/users/${user?._id}`).then((res) => {
      refetch();
      console.log(res);
      if (res.data.data.acknowledged) {
        toast.success(`${user.name} is now admin`);
      }
    });
  };
  const handleRemoveUser = (user) => {
    axiosSecure.delete(`/users/${user?._id}`).then((res) => {
      refetch();
      if (res.data.data.acknowledged) {
        toast.success(`${user?.name} is deleted`);
      }
    });
  };

  return (
    <div>
      <h1 className="font-semibold text-3xl my-5">All users</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra text-xl font-semibold">
          {/* head */}
          <thead>
            <tr className="font-semibold text-xl">
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers &&
              allUsers.map((user, i) => (
                <tr key={user?._id}>
                  <th>{i + 1}</th>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>
                    {user.role ? (
                      <></>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-success mx-2  normal-case">
                        Make Admin
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveUser(user)}
                      className="btn btn-error mx-2  normal-case">
                      Remove user
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

export default AllUsers;

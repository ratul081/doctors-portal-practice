import React from "react";

const AddDoctors = () => {
  return (
    <div className="">
      <h1 className="font-semibold text-3xl mb-8 ">Add a new doctor</h1>
      <div className="bg-white rounded p-12 flex flex-col justify-center lg:w-1/2 m-4 space-y-2">
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Name
          </label>
          <input
            className="input input-bordered w-full "
            type="text"
            name=""
            id=""
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Email
          </label>
          <input
            className="input input-bordered w-full "
            type="text"
            name=""
            id=""
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Specialty
          </label>
          <select className="select select-bordered w-full " name="" id="">
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddDoctors;

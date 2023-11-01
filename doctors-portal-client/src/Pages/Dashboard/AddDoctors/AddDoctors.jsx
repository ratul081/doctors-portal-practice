import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const image = import.meta.env.VITE_image_upload_token;

const AddDoctors = () => {
  const [axiosSecure] = useAxiosSecure();
  const imageHostingURL = `https://api.imgbb.com/1/upload?key=${image}`;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleAddDoctors = (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    axios
      .post(imageHostingURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((imageUploadRes) => {
        if (imageUploadRes.data.success) {
          const imgURL = imageUploadRes.data.data.display_url;
          console.log("🚀 ~ file: AddDoctors.jsx:26 ~ .then ~ imgURL:", imgURL);
          const { name, email, specialty } = data;
          const doctorDetails = {
            doctors_name: name,
            doctors_email: email,
            doctors_specialty: specialty,
            doctors_image: imgURL,
          };
          axiosSecure
            .post("/add-doctors", doctorDetails)
            .then((res) => {
              // console.log(res.data.data);
              if (res.data.data.acknowledged) {
                toast.success(`${name} Doctor Added`);
              } else {
                // console.log(res.data.data);
                toast.error(res.data.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      });
  };
  return (
    <div className="">
      <h1 className="font-semibold text-3xl mb-8 ">Add a new doctor</h1>
      <form
        onSubmit={handleSubmit(handleAddDoctors)}
        className="bg-white rounded p-12 flex flex-col justify-center lg:w-1/2 m-4 space-y-2">
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Name
          </label>
          <input
            className="input input-bordered w-full "
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
              maxLength: 80,
            })}
          />
          {errors.name && (
            <p className="text-red-600">{errors?.name?.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Email
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "Email Address is required",
              pattern: /^\S+@\S+$/i,
            })}
          />
          {errors.email && (
            <p className="text-red-600">{errors.email?.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-semibold my-2" htmlFor="">
            Specialty
          </label>
          <select
            className="select select-bordered w-full"
            {...register("specialty", {
              required: "Please select a specialty",
            })}>
            <option value="" className="cursor-not-allowed" hidden>
              Choose specialty
            </option>
            <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
            <option value="Teeth Orthodontics">Teeth Orthodontics</option>
            <option value="Teeth Cleaning">Teeth Cleaning</option>
            <option value="Cavity Protection">Cavity Protection</option>
            <option value="Pediatric Dental">Pediatric Dental</option>
            <option value="Oral Surgery">Oral Surgery</option>
          </select>
          {errors.specialty && (
            <p className="text-red-600">{errors.specialty?.message}</p>
          )}
          <input
            type="file"
            {...register("image", { required: "Please input a photo" })}
            className="file-input file-input-bordered file-input-success mt-4"
          />
          {errors.image && (
            <p className="text-red-600">{errors.image?.message}</p>
          )}
          <input
            type="submit"
            className="btn btn-primary my-4"
            value="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AddDoctors;

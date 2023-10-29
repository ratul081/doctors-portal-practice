import React from "react";
import Header from "../Pages/Shared/Header";
import Footer from "../Pages/Shared/Footer";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="bg-[#F1F5F9]">
      <Header></Header>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content m-12">
          {/* Page content here */}
          <Outlet></Outlet>
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden">
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 space-y-4 text-base-content">
            {/* Sidebar content here */}
            <li>
              <Link
                className="text-xl font-semibold"
                to="/dashboard/my-appointment">
                My appointment
              </Link>
            </li>
            <li>
              <Link className="text-xl font-semibold" to="/dashboard/all-users">
                All users
              </Link>
            </li>
            <li>
              <Link
                className="text-xl font-semibold"
                to="/dashboard/add-doctors">
                Add doctors
              </Link>
            </li>
            <li>
              <Link
                className="text-xl font-semibold"
                to="/dashboard/manage-Doctors">
                Manage Doctors
              </Link>
            </li>
            <li>
              <Link className="text-xl font-semibold" to="/">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;

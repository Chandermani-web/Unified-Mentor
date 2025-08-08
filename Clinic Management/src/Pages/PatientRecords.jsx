import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import useFetchTokens from "../Utils/FetchAllToken.js";
import { getDatabase, ref, update } from "firebase/database";

const db = getDatabase();

const PatientRecords = () => {
  const tokenList = useFetchTokens();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPatients = tokenList.filter((patient) => {
    const namematch = patient.patientname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? patient.active
        : !patient.active;

    return namematch && statusMatch;
  });

  const changestatus = async (status, TokenNumber, Name) => {
    const patientRef = ref(db, `assigntokens/${TokenNumber}(${Name})`);

    try {
      await update(patientRef, {
        active: status === "Active" ? true : false,
      });

      toast.success("✅ Token status updated successfully", {
        position: "top-right",
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
      });
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col py-10 xl:w-[70%]">
        <h1 className="text-2xl text-black font-bold">Patient Records</h1>
        <p className="text-zinc-400 text-xs">
          Manage patient information, visit history, and prescriptions.
        </p>

        <div className="bg-white w-full mt-10 border-1 border-gray-300 p-4 rounded-sm flex flex-col gap-2">
          <div className="">
            <h1 className="text-xl font-semibold"><i className="ri-file-text-line"></i>Patient Database</h1>
            <p className="text-zinc-400 text-xs">
              View and manage patient information
            </p>
          </div>
          <div className="flex justify-between gap-3">
            <div className="flex-1 flex gap-4 border-1 border-gray-400 bg-gray-100 rounded-sm p-2">
              <i className="ri-search-line text-gray-400"></i>
              <input
                type="text"
                placeholder="search patient by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-0 bg-transparent w-full capitalize"
              />
            </div>
            <div className=" border-1 border-gray-400 p-2 bg-gray-100 rounded-sm text-gray-600 flex gap-2">
              <i className="ri-filter-line"></i>
              <select
                className="outline-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">InActive</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between py-5 text-gray-500 text-xs font-semibold">
              <h3 className="flex-1">Patient Name</h3>
              <h3 className="flex-1">Age</h3>
              <h3 className="flex-1">Phone</h3>
              <h3 className="flex-1">Last Visit</h3>
              <h3 className="flex-1">Condition</h3>
              <h3 className="">Status</h3>
            </div>
            {filteredPatients.map((patient, index) => (
              <div key={index}>
                <hr className="text-gray-500" />
                <div className="flex items-baseline py-2 text-xs font-semibold">
                  <h3 className="flex-1">{patient.patientname}</h3>
                  <h3 className="flex-1">{patient.patientage}</h3>
                  <h3 className="flex-1">{patient.patientphone}</h3>
                  <h3 className="flex-1">{patient.date}</h3>
                  <h3 className="flex-1 line-clamp-1">{patient.patientsymptoms}</h3>
                  {patient.active ? (
                    <h3
                      className="bg-green-600 text-white p-2 cursor-pointer ml-2 rounded-2xl hover:bg-blue-600 hover:text-white transition duration-300"
                      onClick={() =>
                        changestatus("InActive", patient.TokenNumber, patient.patientname)
                      }
                    >
                      Active
                    </h3>
                  ) : (
                    <h3
                      className="bg-gray-400 text-black p-2 cursor-pointer rounded-2xl hover:bg-gray-600 hover:text-white transition duration-300"
                      onClick={() =>
                        changestatus("Active", patient.TokenNumber, patient.patientname)
                      }
                    >
                      Inactive
                    </h3>
                  )}
                </div>
                <ToastContainer />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;

import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, update } from "firebase/database";
import useFetchTokens from "../Utils/FetchAllToken";

const db = getDatabase();

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");

  // Signin Details
  const UserDetails = useSelector((state) => state.signin);
  const UserActiveRole = UserDetails.activeRole;

  // Patient Details
  const Patients = useFetchTokens();
  const TotalPatients = Patients.length;
  const TodayPatients = Patients.filter(
    (patient) => patient.date === new Date().toLocaleDateString()
  );
  const completeTodayPatients = TodayPatients.filter(
    (patient) => patient.active === false
  );
  const ActiveTokens = Patients.filter((patient) => patient.active === true);

  const todayDate = new Date().toLocaleDateString();

  // Doctor Dashboard
  const filteredPatients = Patients.filter((patient) => {
    const namematch = patient.patientname
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    let dateMatch = true;
    if (dateFilter === "today") {
      dateMatch = patient.date === todayDate;
    }

    return namematch && dateMatch;
  }).sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));

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

  // Receptionist Dashboard

  const FilterPatients = TodayPatients.filter((patient) => {
    const namematch = 
    patient.active === true &&
    patient.patientname?.toLowerCase().includes(searchTerm.toLowerCase());
      
    return namematch;
  });

  return (
    <div className="flex justify-center">
      <div className="flex flex-col py-10 xl:w-[70%] gap-6">
        {UserActiveRole === "doctor" ? (
          <div>
            <h1 className="text-2xl text-black font-bold">Doctor Dashboard</h1>
            <p className="text-zinc-400 text-xs">
              Manage your patient and appointments
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-black font-bold">
              Receptionist Dashboard
            </h1>
            <p className="text-zinc-400 text-xs">
              Handles patient tokens and appointments
            </p>
          </div>
        )}

        <div className="flex gap-5">
          {[
            {
              heading: "Total Patients",
              value: TotalPatients,
              icon: "ri-group-line",
              last: "+12 from last month",
            },
            {
              heading: "Today Patients",
              value: TodayPatients.length,
              icon: "ri-calendar-2-line",
              last: `Completed Patient: ${completeTodayPatients.length}`,
            },
            {
              heading: "Active Tokens",
              value: ActiveTokens.length,
              icon: "ri-time-line",
              last: "",
            },
          ].map((field, i) => (
            <div
              key={i}
              className="flex-1 p-6 rounded-xl bg-white border border-gray-300 flex flex-col gap-2"
            >
              <div className="flex justify-between font-semibold text-sm text-gray-600">
                <h4>{field.heading}</h4>
                <i className={`${field.icon} font-light text-gray-500`}></i>
              </div>
              <div className="ml-1 leading-[8px]">
                <h1 className="text-2xl font-semibold">{field.value}</h1>
                <p className="text-[13px] text-gray-400">{field.last}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white w-full mt-10 border-1 border-gray-300 p-4 rounded-2xl">
          {UserActiveRole === "doctor" ? (
            // Doctor Dashboard
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-xl font-semibold">Recent Patients</h1>
                <p className="text-zinc-400 text-xs">
                  View and search patient records
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
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
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-400 rounded-sm p-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="today">Today</option>
                  </select>
                </div>

                <div className="flex flex-col gap-4">
                  {filteredPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 border-1 border-gray-300 rounded-sm"
                    >
                      {/* Left panel */}
                      <div className="flex flex-col gap-1">
                        {/* left-top panel */}
                        <div className="flex gap-3">
                          <span className="px-5 py-3 text-sm bg-blue-50 text-blue-600 rounded-[50%] text-center font-bold">
                            {patient.patientname[0]}
                          </span>
                          <div>
                            <h2 className="text-sm capitalize">
                              {patient.patientname}
                            </h2>
                            <p className="text-xs text-gray-400">
                              Age: {patient.patientage}
                            </p>
                          </div>
                        </div>
                        {/* left-bottom panel */}
                        <div>
                          <p className="text-gray-400 text-xs">
                            {patient.patientsymptoms}
                          </p>
                        </div>
                      </div>

                      {/* Right panel */}
                      <div className="">
                        {patient.active ? (
                          <h1
                            className="bg-yellow-600 text-white text-xs py-1 px-4 rounded-2xl text-center cursor-pointer "
                            onClick={() => {
                              changestatus(
                                "InActive",
                                patient.TokenNumber,
                                patient.patientname
                              );
                            }}
                          >
                            Pending
                          </h1>
                        ) : (
                          <h1
                            className="bg-green-600 text-white text-xs py-1 px-4 rounded-2xl text-center cursor-pointer"
                            onClick={() => {
                              changestatus(
                                "Active",
                                patient.TokenNumber,
                                patient.patientname
                              );
                            }}
                          >
                            Completed
                          </h1>
                        )}
                        <p className="text-xs text-gray-400">
                          Last Visit: {patient.date}
                        </p>
                      </div>
                    </div>
                  ))}
                  <ToastContainer />
                </div>
              </div>
            </div>
          ) : (
            // Receptionist Dashboard
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-xl font-semibold">Patient Tokens</h1>
                <p className="text-zinc-400 text-xs">
                  Manage today's patient tokens
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
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
                </div>

                <div className="flex flex-col gap-4">
                  {FilterPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 border-1 border-gray-300 rounded-sm items-center"
                    >
                      {/* Left panel */}
                      <div className="flex flex-col gap-1">
                        {/* left-top panel */}
                        <div className="flex gap-2">
                          <span className="w-12 py-3 text-sm bg-blue-50 text-blue-600 text-center font-bold">
                            {patient.TokenNumber}
                          </span>
                          <div>
                            <h2 className="text-sm capitalize">
                              {patient.patientname}
                            </h2>
                            <p className="text-xs text-gray-400">
                              {patient.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right panel */}
                      <div className="">
                        {patient.active ? (
                          <h1 className="bg-gray-300 text-black font-semibold text-xs py-1 px-4 rounded-2xl text-center cursor-pointer">
                            Waiting
                          </h1>
                        ) : (
                          false
                        )}
                      </div>
                    </div>
                  ))}
                  <ToastContainer />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

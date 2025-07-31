// src/components/AssignToken.jsx
import React, { useState } from "react";
import "remixicon/fonts/remixicon.css";
import { useDispatch, useSelector } from "react-redux";
import { assigntokens } from "../Store/AssignToken.Slice.js";

const AssignToken = () => {
  const dispatch = useDispatch();
  const totaltoken = useSelector((state) => state.token.token);
  const tokenList = useSelector((state) =>
    state.token.token.filter((t) => t.date === new Date().toLocaleDateString())
  );

  const [Assigntokendetails, setAssigntokendetails] = useState({
    patientname: "",
    patientage: "",
    patientphone: "",
    patientpriority: "Normal",
    patientsymptoms: "",
  });

  const TokenNumber = totaltoken.length
    ? totaltoken.length + 1
    : 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assigntokens({ Assigntokendetails, TokenNumber }));
    setAssigntokendetails({
      patientname: "",
      patientage: "",
      patientphone: "",
      patientpriority: "Normal",
      patientsymptoms: "",
    });
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col py-10 xl:w-[70%]">
        <h1 className="text-3xl text-zinc-700 font-bold">
          Assign Patient Token
        </h1>
        <p className="text-zinc-600">
          Register new patients and assign them consultation tokens
        </p>
        <div className="mt-10 gap-5 flex">
          {/* Left Panel */}
          <div className="border border-gray-300 bg-white w-2/3 rounded-xl p-5">
            <div>
              <h1 className="text-2xl font-semibold">
                <i className="ri-coupon-2-line text-blue-500"></i> New Token
                Assignment
              </h1>
              <p className="text-zinc-600 text-sm">
                Fill in patient details to assign a new consultation token
              </p>
            </div>
            <form
              className="grid grid-cols-2 gap-4 mt-5"
              onSubmit={handleSubmit}
            >
              {[
                {
                  label: "Patient Name*",
                  icon: "ri-user-line",
                  id: "patientname",
                  type: "text",
                  placeholder: "Enter patient's full name",
                },
                {
                  label: "Patient Age*",
                  id: "patientage",
                  type: "number",
                  placeholder: "Enter patient's Age",
                },
                {
                  label: "Patient Phone*",
                  id: "patientphone",
                  type: "text",
                  placeholder: "Enter patient's Phone Number",
                },
              ].map((field, i) => (
                <div className="flex flex-col" key={i}>
                  <label
                    className="text-sm p-1 font-semibold"
                    htmlFor={field.id}
                  >
                    {field.icon && <i className={`${field.icon}`}></i>}{" "}
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={Assigntokendetails[field.id]}
                    onChange={(e) =>
                      setAssigntokendetails({
                        ...Assigntokendetails,
                        [field.id]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    required
                    className="bg-zinc-200 py-1 px-3 rounded-sm placeholder:text-zinc-500 outline-0 placeholder:text-[12px] z-auto border border-gray-400"
                  />
                </div>
              ))}

              {/* Priority Select */}
              <div className="flex flex-col">
                <label
                  className="text-sm p-1 font-semibold"
                  htmlFor="patientpriority"
                >
                  Priority*
                </label>
                <select
                  name="patientpriority"
                  id="patientpriority"
                  value={Assigntokendetails.patientpriority}
                  onChange={(e) =>
                    setAssigntokendetails({
                      ...Assigntokendetails,
                      patientpriority: e.target.value,
                    })
                  }
                  className="bg-zinc-200 text-sm py-1 rounded-sm outline-0 border border-gray-400"
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Symptoms Textarea */}
              <div className="col-span-2 flex flex-col">
                <label
                  className="text-sm p-1 font-semibold"
                  htmlFor="patientsymptoms"
                >
                  <i className="ri-file-list-line"></i> Symptoms / Reason for
                  Visit*
                </label>
                <textarea
                  id="patientsymptoms"
                  name="patientsymptoms"
                  value={Assigntokendetails.patientsymptoms}
                  onChange={(e) =>
                    setAssigntokendetails({
                      ...Assigntokendetails,
                      patientsymptoms: e.target.value,
                    })
                  }
                  placeholder="Describe the symptoms or reason for consultation"
                  className="bg-zinc-200 py-1 px-3 rounded-sm placeholder:text-zinc-500 outline-0 placeholder:text-[12px] z-auto border border-gray-400 h-24"
                  required
                ></textarea>
              </div>

              <div className="col-span-2 flex flex-col justify-between gap-3 p-2 bg-zinc-200 rounded-sm border-1 border-gray-400 font-semibold">
                <h1 className="text-sm">Token Information</h1>
                <div className="flex justify-between px-6">
                  <p className="text-sm text-gray-400">
                    Next Token:{" "}
                    <span className="font-semibold text-black">
                      {TokenNumber}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Estimated Time:{" "}
                    <span className="font-semibold text-black">
                      {new Date(Date.now() + 90 * 60 * 1000).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white w-full p-2 rounded-2xl hover:bg-blue-600 transition duration-200"
                >
                  <i className="ri-coupon-2-line mr-4"></i> Assign Token
                </button>
              </div>
            </form>
          </div>

          {/* Right Panel: Token List */}
          <div className="border border-gray-300 rounded-xl bg-white w-1/3 p-4 overflow-auto h-[500px]">
            <div>
              <h1 className="text-2xl text-black font-semibold">
                <i className="ri-time-line text-blue-600"></i> Today's Tokens
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Currently assigned Tokens
              </p>

              {/* Inside Right Panel */}
              {tokenList.length === 0 ? (
                <p className="text-gray-400">No tokens assigned yet.</p>
              ) : (
                tokenList.map((token, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 border-1 border-gray-200 rounded-2xl mb-2"
                  >
                    <div>
                      <h1 className="text-lg font-semibold text-blue-700">
                        Token #{token.TokenNumber}
                      </h1>
                      <p className=" text-black capitalize">
                        {token.patientname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {token.time}
                      </p>
                    </div>
                    <div className="flex flex-col gap-5">
                      <h1 className={`border-1 text-white font-semibold rounded-2xl p-1.5 text-center text-sm ${token.patientpriority.toLowerCase() === "urgent" ? "bg-red-500" : token.patientpriority.toLowerCase() === "high" ? "bg-yellow-500" : "bg-green-500"}`}>{token.patientpriority}</h1>
                      <span className="text-xs text-gray-500">{token.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignToken;

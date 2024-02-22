"use client";

import { useEffect, useState } from "react";
import Uploader from "../components/Uploader";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import { InternshipData } from "../models/InternshipData";
import {
  categorizeByGPA,
  categorizeByGPAPie,
  countByCampus,
  countByProgram,
  countByTrack,
  countByTrackID,
} from "../utils/chartUtils";
import Sidebar from "../components/Sidebar";
import { BarData, PieData } from "../types/ChartData";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Not Logged In!");
    },
  });

  const programs = [
    "Computer Science",
    "Computer Science & Mathematics",
    "Computer Science & Statistics",
    "Cyber Security",
    "Data Science",
    "Game Application and Technology",
    "Mobile Application and Technology",
  ];

  const campuses = [
    "Binus Alam Sutera",
    "Binus Kemanggisan",
    "Binus Bandung",
    "Binus Malang",
  ];

  const statuses = ["Accepted", "Not Yet Accepted"];
  const enrollments = ["Enrolled", "Not Yet Enrolled"];

  const [uploadedData, setUploadedData] = useState<InternshipData[]>([]);
  const [trackData, setTrackData] = useState<PieData[]>([]);
  const [trackBarData, setTrackBarData] = useState<BarData[]>([]);
  const [gpaData, setGpaData] = useState<BarData[]>([]);
  const [gpaPieData, setGpaPieData] = useState<PieData[]>([]);
  const [campusData, setCampusData] = useState<Record<string, number>>();
  const [studentPieData, setStudentPieData] = useState<PieData[]>([]);
  const [studentBarData, setStudentBarData] = useState<BarData[]>([]);
  const [campusPieData, setCampusPieData] = useState<PieData[]>([]);
  const [campusBarData, setCampusBarData] = useState<BarData[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [selectedTrackVis, setSelectedTrackVis] = useState("Pie Chart");
  const [selectedGPAVis, setSelectedGPAVis] = useState("Pie Chart");
  const [selectedStudentVis, setSelectedStudentVis] = useState("Pie Chart");
  const [selectedCampusVis, setSelectedCampusVis] = useState("Pie Chart");

  const [trackByProgram, setTrackByProgram] = useState("All Programs");
  const [gpaByProgram, setGpaByProgram] = useState("All Programs");

  const [showTrackFilterDialog, setShowTrackFilterDialog] = useState(false);
  const [showGPAFilterDialog, setShowGPAFilterDialog] = useState(false);
  const [showStudentFilterDialog, setShowStudentFilterDialog] = useState(false);
  const [showCampusFilterDialog, setShowCampusFilterDialog] = useState(false);

  const handleSemesterChange = (event: any) => {
    setSelectedSemester(event.target.value);
  };

  const handleAreaChange = (event: any) => {
    setSelectedArea(event.target.value);
  };

  const handleTrackVisChange = (event: any) => {
    setSelectedTrackVis(event.target.value);
  };

  const handleGPAVisChange = (event: any) => {
    setSelectedGPAVis(event.target.value);
  };

  const handleStudentVisChange = (event: any) => {
    setSelectedStudentVis(event.target.value);
  };

  const handleCampusVisChange = (event: any) => {
    setSelectedCampusVis(event.target.value);
  };

  const handleProgramTrackChange = (event: any) => {
    const selectedProgram = event.target.value;
    setTrackByProgram(selectedProgram);

    // Filter the uploaded data based on the selected program
    const filteredData =
      selectedProgram === "All Programs"
        ? uploadedData
        : uploadedData.filter(
            (item) => item.ACADEMIC_PROGRAM === selectedProgram
          );

    console.log("Filtered Data:", filteredData);

    // Calculate new track data
    const newTrackData = Object.keys(countByTrack(filteredData)).map(
      (track, index) => ({
        name: track,
        value: countByTrack(filteredData)[track],
        color: legendColors[index % legendColors.length],
      })
    );

    console.log("New Track Data:", newTrackData);

    // Calculate new track bar data
    const newTrackBarData = Object.keys(countByTrackID(filteredData)).map(
      (id, index) => ({
        category: id,
        count: countByTrackID(filteredData)[id],
        color: legendColors[index % legendColors.length],
      })
    );

    console.log("New Track Bar Data:", newTrackBarData);

    // Update state variables
    setTrackData(newTrackData);
    setTrackBarData(newTrackBarData);
  };

  const handleGPATrackChange = (event: any) => {
    const selectedProgram = event.target.value;
    setGpaByProgram(selectedProgram);

    // Filter the uploaded data based on the selected program
    const filteredData =
      selectedProgram === "All Programs"
        ? uploadedData
        : uploadedData.filter(
            (item) => item.ACADEMIC_PROGRAM === selectedProgram
          );

    console.log("Filtered Data:", filteredData);

    const newGpaPieData = categorizeByGPAPie(filteredData);
    setGpaPieData(newGpaPieData);

    const newGpaData = categorizeByGPA(filteredData);
    setGpaData(newGpaData);
  };

  // filter each graph
  const handleTrackFilterClick = () => {
    setShowTrackFilterDialog(true);
  };

  const handleCloseTrackFilterDialog = () => {
    setShowTrackFilterDialog(false);
  };

  const handleGPAFilterClick = () => {
    setShowGPAFilterDialog(true);
  };

  const handleCloseGPAFilterDialog = () => {
    setShowGPAFilterDialog(false);
  };

  const handleStudentFilterClick = () => {
    setShowStudentFilterDialog(true);
  };

  const handleCloseStudentFilterDialog = () => {
    setShowStudentFilterDialog(false);
  };

  const handleCampusFilterClick = () => {
    setShowCampusFilterDialog(true);
  };

  const handleCloseCampusFilterDialog = () => {
    setShowCampusFilterDialog(false);
  };

  const trackDictionary = trackBarData.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]: trackData[index % trackData.length]?.name || "",
    };
  }, {});

  const studentDictionary = studentBarData.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]:
        studentPieData[index % studentPieData.length]?.name || "",
    };
  }, {});

  function getInitialsOfWords(input: string): string {
    const words = input.trim().split(" ");

    const initials = words.map((word) => word.charAt(0).toUpperCase());

    return initials.join("");
  }

  const handleDataUpload = (data: InternshipData[]) => {
    setUploadedData(data);

    console.log(uploadedData);

    const newProgramPieData = Object.keys(countByProgram(data)).map(
      (program, index) => ({
        name: program,
        value: countByProgram(data)[program],
        color: legendColors[index % legendColors.length],
      })
    );
    setStudentPieData(newProgramPieData);

    const newProgramBarData = Object.keys(countByProgram(data)).map(
      (program, index) => ({
        category: getInitialsOfWords(program),
        count: countByProgram(data)[program],
        color: legendColors[index % legendColors.length],
      })
    );
    console.log("Program Bar Data Uploaded: ", newProgramBarData);
    setStudentBarData(newProgramBarData);

    const newCampusPieData = Object.keys(countByCampus(data)).map(
      (campus, index) => ({
        name: campus,
        value: countByCampus(data)[campus],
        color: legendColors[index % legendColors.length],
      })
    );
    setCampusPieData(newCampusPieData);

    const newCampusBarData = Object.keys(countByCampus(data)).map(
      (campus, index) => ({
        category: getInitialsOfWords(campus),
        count: countByCampus(data)[campus],
        color: legendColors[index % legendColors.length],
      })
    );
    console.log("Program Bar Data Uploaded: ", newProgramBarData);
    setCampusBarData(newCampusBarData);

    const newTrackData = Object.keys(countByTrack(data)).map(
      (track, index) => ({
        name: track,
        value: countByTrack(data)[track],
        color: legendColors[index % legendColors.length],
      })
    );
    console.log("Track Data Uploaded: ", newTrackData);
    setTrackData(newTrackData);

    const newTrackBarData = Object.keys(countByTrackID(data)).map(
      (id, index) => ({
        category: id,
        count: countByTrackID(data)[id],
        color: legendColors[index % legendColors.length],
      })
    );
    setTrackBarData(newTrackBarData);

    const newGpaPieData = categorizeByGPAPie(data);
    setGpaPieData(newGpaPieData);

    const newGpaData = categorizeByGPA(data);
    setGpaData(newGpaData);

    const campusCounts = countByCampus(data);
    setCampusData(campusCounts);
  };

  const legendColors = [
    "#079bde",
    "#d12318",
    "#f08700",
    "#ffff00",
    "#ff00ff",
    "#69bcea",
  ];

  if (status === "loading") {
    redirect("/");
  }

  console.log(gpaPieData);
  console.log(trackData);

  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6 content bg-[#e1eef5] py-[3vh] px-[3vh] h-[100vh] overflow-scroll">
        <div className="py-[3vh] px-[3vw] bg-white flex rounded-xl">
          <div className="w-full py-[3vh] flex flex-col gap-y-[3vh]">
            <div className="w-full bg-white flex justify-between items-center">
              <div className="w-1/2">
                <p className="text-4xl font-bold mr-10">Dashboard</p>
              </div>

              {/* semester */}
              <div className="w-1/2 flex justify-end">
                <div className="mr-5">
                  <select
                    id="semesterSelect"
                    defaultValue={selectedSemester}
                    onChange={handleSemesterChange}
                    className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mb-2"
                  >
                    <option value="">Select Semester</option>
                    <option value="Semester(1)">Semester(1)</option>
                    <option value="Semester(2)">Semester(2)</option>
                  </select>
                </div>

                {/* campus area */}
                <div className="mr-5">
                  <select
                    id="areaSelect"
                    defaultValue={selectedArea}
                    onChange={handleAreaChange}
                    className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mb-2"
                  >
                    <option value="">All Campuses</option>
                    {campuses.map((area) => (
                      <option value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <Uploader onDataUpload={handleDataUpload} />
            </div>
          </div>
        </div>
        {uploadedData && uploadedData.length > 0 && (
          <div className="w-full">
            <div className="w-full flex flex-row items-stretch py-[2vh] gap-x-[2vh]">
              <div className="w-full flex-1 rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-start">
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold">Student Chart</h2>
                    <p>by Academic Program</p>
                  </div>
                  <button
                    onClick={handleStudentFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
                  {selectedStudentVis === "Bar Chart" && (
                    <div className="py-6">
                      <BarChart width={450} height={500} data={studentBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#d12318" />
                      </BarChart>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "20px",
                        }}
                      >
                        {Object.entries(studentDictionary).map(
                          ([key, value]: any) => (
                            <div key={key}>
                              <p>
                                {key}: {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedStudentVis === "Pie Chart" && (
                    <PieChart width={400} height={500}>
                      {/* Data for the pie chart */}
                      <Pie
                        data={studentPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        dataKey="value"
                      >
                        {/* Customizing the colors of each sector */}
                        {studentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                      {/* Adding legend and tooltip */}
                      <Legend
                        content={({ payload }) => (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              display: "flex",
                              flexWrap: "wrap",
                            }}
                          >
                            {payload.map((entry, index) => (
                              <li
                                key={`legend-${index}`}
                                style={{
                                  marginRight: "20px",
                                  marginBottom: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: entry.color,
                                    marginRight: "8px",
                                  }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#000" }}
                                >
                                  {entry.value} (
                                  {
                                    studentPieData.find(
                                      (item) => item.name === entry.value
                                    )?.value
                                  }
                                  )
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      />

                      <Tooltip />
                    </PieChart>
                  )}
                </div>
              </div>
              <div className="w-full flex-1 rounded-xl flex flex-col bg-white px-[2vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-center">
                  <h2 className="text-2xl font-semibold">Campus Chart</h2>
                  <button
                    onClick={handleCampusFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {selectedCampusVis === "Pie Chart" && (
                    <PieChart width={400} height={450}>
                      {/* Data for the pie chart */}
                      <Pie
                        data={campusPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        dataKey="value"
                      >
                        {/* Customizing the colors of each sector */}
                        {campusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                      {/* Adding legend and tooltip */}
                      <Legend
                        content={({ payload }) => (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              display: "flex flex-wrap",
                            }}
                          >
                            {payload.map((entry, index) => (
                              <li
                                key={`legend-${index}`}
                                style={{
                                  marginRight: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: campusPieData[index].color,
                                    marginRight: "8px",
                                  }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#000" }}
                                >
                                  {entry.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      />
                      <Tooltip />
                    </PieChart>
                  )}

                  {selectedCampusVis === "Bar Chart" && (
                    <div className="py-6">
                      <BarChart width={400} height={400} data={campusBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#079bde" />
                      </BarChart>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row items-stretch py-[2vh] gap-x-[2vh]">
              <div className="w-full flex-1 rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-start">
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold">Enrichment Track</h2>
                    {trackByProgram !== "All Programs" && (
                      <p>by {trackByProgram}</p>
                    )}
                  </div>
                  <button
                    onClick={handleTrackFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
                  {selectedTrackVis === "Bar Chart" && (
                    <>
                      <BarChart width={400} height={400} data={trackBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#d12318" />
                      </BarChart>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "20px",
                        }}
                      >
                        {Object.entries(trackDictionary).map(
                          ([key, value]: any) => (
                            <div key={key}>
                              <p>
                                {key}: {value}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                  {selectedTrackVis === "Pie Chart" && (
                    <PieChart width={400} height={500}>
                      {/* Data for the pie chart */}
                      <Pie
                        data={trackData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        dataKey="value"
                      >
                        {/* Customizing the colors of each sector */}
                        {trackData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                      {/* Adding legend and tooltip */}
                      <Legend
                        content={({ payload }) => (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {payload.map((entry, index) => (
                              <li
                                key={`legend-${index}`}
                                style={{
                                  marginRight: "20px",
                                  marginBottom: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: entry.color,
                                    marginRight: "8px",
                                  }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#000" }}
                                >
                                  {entry.value} (
                                  {
                                    trackData.find(
                                      (item) => item.name === entry.value
                                    )?.value
                                  }
                                  )
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      />

                      <Tooltip />
                    </PieChart>
                  )}
                </div>
              </div>
              <div className="w-full flex-1 rounded-xl flex flex-col bg-white px-[2vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-center">
                  <h2 className="text-2xl font-semibold">GPA Chart</h2>
                  <button
                    onClick={handleGPAFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {selectedGPAVis === "Pie Chart" && (
                    <PieChart width={400} height={400}>
                      {/* Data for the pie chart */}
                      <Pie
                        data={gpaPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                        dataKey="value"
                      >
                        {/* Customizing the colors of each sector */}
                        {gpaPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>

                      {/* Adding legend and tooltip */}
                      <Legend
                        content={({ payload }) => (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              display: "flex flex-wrap",
                            }}
                          >
                            {payload.map((entry, index) => (
                              <li
                                key={`legend-${index}`}
                                style={{
                                  marginRight: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: gpaPieData[index].color,
                                    marginRight: "8px",
                                  }}
                                />
                                <span
                                  className="text-xs"
                                  style={{ color: "#000" }}
                                >
                                  {entry.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      />
                      <Tooltip />
                    </PieChart>
                  )}

                  {selectedGPAVis === "Bar Chart" && (
                    <div className="py-6">
                      <BarChart width={400} height={400} data={gpaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#079bde" />
                      </BarChart>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {showTrackFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleCloseTrackFilterDialog}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Filter options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Modify Chart</h3>

                    {/* Add checkboxes for each program */}
                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Visualization Type
                      </h2>
                      <select
                        id="visSelect"
                        value={selectedTrackVis}
                        onChange={handleTrackVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                      </select>
                    </div>

                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Filter by Academic Program
                      </h2>
                      <select
                        id="visSelect"
                        value={trackByProgram}
                        onChange={handleProgramTrackChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="All Programs">All Programs</option>

                        {programs.map((program, index) => (
                          <option key={index} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showGPAFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleCloseGPAFilterDialog}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Filter options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Modify Chart</h3>

                    {/* Add checkboxes for each program */}
                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Visualization Type
                      </h2>
                      <select
                        id="visSelect"
                        value={selectedGPAVis}
                        onChange={handleGPAVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                      </select>
                    </div>

                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Filter by Academic Program
                      </h2>
                      <select
                        id="visSelect"
                        value={gpaByProgram}
                        onChange={handleGPATrackChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="All Programs">All Programs</option>

                        {programs.map((program, index) => (
                          <option key={index} value={program}>
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showStudentFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleCloseStudentFilterDialog}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Filter options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Modify Chart</h3>

                    {/* Add checkboxes for each program */}
                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Visualization Type
                      </h2>
                      <select
                        id="visSelect"
                        value={selectedStudentVis}
                        onChange={handleStudentVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showCampusFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleCloseCampusFilterDialog}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Filter options */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Modify Chart</h3>

                    {/* Add checkboxes for each program */}
                    <div>
                      <h2 className="text-md font-semibold mb-2">
                        Visualization Type
                      </h2>
                      <select
                        id="visSelect"
                        value={selectedCampusVis}
                        onChange={handleCampusVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

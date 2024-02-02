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
  countByTrack,
  countByTrackID,
} from "../utils/chartUtils";
import Sidebar from "../components/Sidebar";
import {
  GpaChartData,
  GpaPieData,
  TrackBarData,
  TrackChartData,
} from "../types/ChartData";
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

  const statuses = ["Accepted", "Not Yet Accepted"];
  const enrollments = ["Enrolled", "Not Yet Enrolled"];

  const [uploadedData, setUploadedData] = useState<InternshipData[]>([]);
  const [filteredData, setFilteredData] = useState<InternshipData[]>([]);
  const [trackData, setTrackData] = useState<TrackChartData[]>([]);
  const [trackBarData, setTrackBarData] = useState<TrackBarData[]>([]);
  const [gpaData, setGpaData] = useState<GpaChartData[]>([]);
  const [gpaPieData, setGpaPieData] = useState<GpaPieData[]>([]);
  const [campusData, setCampusData] = useState<Record<string, number>>();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTrackVis, setSelectedTrackVis] = useState("Pie Chart");
  const [selectedGPAVis, setSelectedGPAVis] = useState("Pie Chart");
  const [selectedAcads, setSelectedAcads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEnrollment, setEnrollmentStatus] = useState("");
  const [selectedGpaCategories, setSelectedGpaCategories] = useState([]);

  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Choose the number of items to display per page

  const [sortOrder, setSortOrder] = useState({
    field: "",
    ascending: true,
  });

  const handleHeaderClick = (field: string) => {
    if (sortOrder.field === field) {
      setSortOrder({
        field,
        ascending: !sortOrder.ascending,
      });
    } else {
      setSortOrder({
        field,
        ascending: true,
      });
    }
    setCurrentPage(1);
  };

  const sortData = (data: InternshipData[]): InternshipData[] => {
    const { field, ascending } = sortOrder;
    if (field === "") {
      return data;
    }

    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) {
        return ascending ? -1 : 1;
      } else if (aValue > bValue) {
        return ascending ? 1 : -1;
      } else {
        return 0;
      }
    });

    return sortedData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handleFilterClick = () => {
    setShowFilterDialog(true);
    setCurrentPage(1);
  };

  const handleCloseFilterDialog = () => {
    setShowFilterDialog(false);
    setCurrentPage(1);
  };

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

  const handleAcadChange = (program) => {
    // Toggle the selected program in the array
    if (selectedAcads.includes(program)) {
      setSelectedAcads(selectedAcads.filter((p) => p !== program));
    } else {
      setSelectedAcads([...selectedAcads, program]);
    }
  };

  // Function to handle changes in selected GPA categories
  const handleGpaCategoryChange = (category) => {
    if (selectedGpaCategories.includes(category)) {
      // If the category is already selected, remove it
      setSelectedGpaCategories(selectedGpaCategories.filter(item => item !== category));
    } else {
      // If the category is not selected, add it
      setSelectedGpaCategories([...selectedGpaCategories, category]);
    }
  };

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  const handleEnrollmentChange = (event: any) => {
    setEnrollmentStatus(event.target.value);
  };

  const trackDictionary = trackBarData.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]: trackData[index % trackData.length]?.name || "",
    };
  }, {});

  const gpaCategory = {
    "C": "Cumlaude (3.50 - 3.79)", // Assuming trackData is an array
    "MC": "Magma Cumlaude (3.79 - 3.99)", 
    "SC": "Summa Cumlaude (4.00)", 
    // Add more categories as needed...
  };

   // Function to categorize GPA based on numeric value
  const categorizeGpa = (gpa) => {
    if (gpa >= 3.50 && gpa <= 3.79) {
      return "C";
    } if (gpa >= 3.79 && gpa <= 3.99) {
      return "MC";
    } if (gpa == 4.00) {
      return "SC";
    }  

    return "Invalid"; // Handle other cases or return a default category
  };

  console.log(trackDictionary);

  const handleDataUpload = (data: InternshipData[]) => {
    setUploadedData(data);

    console.log(uploadedData);

    const newTrackData = Object.keys(countByTrack(data)).map(
      (track, index) => ({
        name: track,
        value: countByTrack(data)[track],
        color: legendColors[index % legendColors.length],
      })
    );
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

  useEffect(() => {
    let newFilteredData = uploadedData;

    // Apply filter by academic program
    if (selectedAcads.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        selectedAcads.includes(item.ACADEMIC_PROGRAM)
      );
    }

    if (selectedGpaCategories.length > 0) {
      newFilteredData = newFilteredData.filter((item) => {
        const category = categorizeGpa(parseFloat(item.GPA));
        if (selectedGpaCategories.includes(category)) {
          if (category === "C") {
            return parseFloat(item.GPA) >= 3.50 && parseFloat(item.GPA) <= 3.79;
          } else if (category === "MC") {
            return parseFloat(item.GPA) >= 3.79 && parseFloat(item.GPA) <= 3.99;
          } else if (category === "SC") {
            return parseFloat(item.GPA) === 4.00;
          }
        }
        return false; // Return false for other categories not selected
      });
    }
    
    // const filteredTableData = yourTableData.filter(item => {
    //   const category = categorizeGpa(item.gpa); // Categorize GPA
    //   return selectedGpaCategories.includes(category); // Check if category is selected
    // });

    // Apply filter by status
    if (selectedStatus !== "") {
      newFilteredData = newFilteredData.filter(
        (item) => item.STATUS === selectedStatus
      );
    }

    // Apply filter by enrollment
    if (selectedEnrollment !== "") {
      newFilteredData = newFilteredData.filter(
        (item) => item.ENROLLMENT === selectedEnrollment
      );
    }

    // Sort data
    newFilteredData = sortData(newFilteredData);

    setFilteredData(newFilteredData);
  }, [
    selectedAcads,
    selectedStatus,
    selectedEnrollment,
    uploadedData,
    selectedGpaCategories,
    sortOrder,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination controls
  const handlePrevClick = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6 content bg-[#e1eef5] py-[3vh] px-[3vh] h-[100vh] overflow-scroll">
        <div className="py-[3vh] px-[3vw] bg-white flex rounded-xl">
          <div className="py-[3vh] flex flex-col gap-y-[3vh]">
            <div className="header bg-white flex">
              <p className="text-4xl font-bold mr-10">Dashboard</p>

              {/* semester */}
              <div className="mr-5">
                <select
                  id="semesterSelect"
                  value={selectedSemester}
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
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mb-2"
                >
                  <option value="">Select Area</option>
                  <option value="Area(1)">Area(1)</option>
                  <option value="Area(2)">Area(2)</option>
                </select>
              </div>
            </div>
            <div>
              <Uploader onDataUpload={handleDataUpload} />
            </div>
          </div>
        </div>
        {uploadedData && uploadedData.length > 0 && (
          <div className="w-full">
            {campusData && (
              <div className="flex flex-row gap-x-[2vh] pt-[2vh]">
                {[
                  "Binus Alam Sutera",
                  "Binus Kemanggisan",
                  "Binus Bandung",
                  "Binus Malang",
                ].map((campus) => (
                  <div
                    className="w-1/4 rounded-xl bg-white px-[2vw] py-[2vh] flex flex-col justify-center items-center text-center"
                    key={campus}
                  >
                    <p className="text-xl">{campusData[campus] || "-"}</p>
                    <p className="text-md font-semibold">{campus}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="w-full flex flex-row items-stretch py-[2vh] gap-x-[2vh]">
              <div className="w-full rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-center">
                  <h2 className="text-2xl font-semibold">Enrichment Track</h2>
                  <select
                    id="visSelect"
                    value={selectedTrackVis}
                    onChange={handleTrackVisChange}
                    className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                  >
                    <option value="Pie Chart" selected>
                      Pie Chart
                    </option>
                    <option value="Bar Chart">Bar Chart</option>
                  </select>
                </div>
                <div className="flex flex-col justify-center items-center">
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
                    <PieChart width={400} height={400}>
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
                                    backgroundColor: trackData[index].color,
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
                </div>
              </div>
              <div className="w-full rounded-xl flex flex-col bg-white px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-center">
                  <h2 className="text-2xl font-semibold">GPA Chart</h2>
                  <select
                    id="visSelect"
                    value={selectedGPAVis}
                    onChange={handleGPAVisChange}
                    className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                  >
                    <option value="Pie Chart" selected>
                      Pie Chart
                    </option>
                    <option value="Bar Chart">Bar Chart</option>
                  </select>
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
                                    backgroundColor: gpaPieData[index].color, // Use gpaPieData instead of trackData
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
                    <>
                      <BarChart width={400} height={400} data={gpaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#079bde" />
                      </BarChart>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "20px",
                        }}
                      >
                        {Object.entries(gpaCategory).map(
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
                </div>
              </div>
            </div>
            <div className="w-full bg-white rounded-xl max-h-[90vh] overflow-scroll px-[2vw] py-[3vh]">
              <div className="sticky top-0 left-0 z-10 bg-white">
                <h2 className="text-2xl font-semibold">Students Data</h2>
                <div className="flex flex-row gap-x-1">
                  <div className="pt-[1vh] pb-[2vh]">
                    <button
                      onClick={handleFilterClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              <table className="table-auto border border-collapse">
                <thead>
                  <tr>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("BINUSIAN_ID")}
                    >
                      BINUSIAN ID
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("STUDENT_ID")}
                    >
                      STUDENT ID
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("STUDENT_NAME")}
                    >
                      STUDENT NAME
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("ACADEMIC_PROGRAM_ID")}
                    >
                      ACADEMIC PROGRAM ID
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("ACADEMIC_GROUP")}
                    >
                      ACADEMIC GROUP
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("ACADEMIC_PROGRAM")}
                    >
                      ACADEMIC PROGRAM
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("STUDENT_EMAIL")}
                    >
                      STUDENT EMAIL
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("STUDENT_PHONE")}
                    >
                      STUDENT PHONE
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("CAMPUS")}
                    >
                      CAMPUS
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("TRACK_ID")}
                    >
                      TRACK ID
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("TRACK")}
                    >
                      TRACK
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("GPA")}
                    >
                      GPA
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("TOTAL_SKS")}
                    >
                      TOTAL SKS
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("STATUS")}
                    >
                      STATUS
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("PARTNER_LECTURER")}
                    >
                      PARTNER/LECTURER
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("POSITION_TOPIC")}
                    >
                      POSITION/TOPIC
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("DURATION")}
                    >
                      DURATION
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("JOB_START_DATE")}
                    >
                      JOB START DATE
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("JOB_END_DATE")}
                    >
                      JOB END DATE
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("WORK_SCHEMA")}
                    >
                      WORK SCHEMA
                    </th>
                    <th
                      className="border border-zinc-400 min-w-full px-2 cursor-pointer"
                      onClick={() => handleHeaderClick("ENROLLMENT")}
                    >
                      ENROLLMENT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-zinc-400 px-2">
                        {item.BINUSIAN_ID}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.STUDENT_ID}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.STUDENT_NAME}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.ACADEMIC_PROGRAM_ID}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.ACADEMIC_GROUP}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.ACADEMIC_PROGRAM}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.STUDENT_EMAIL}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.STUDENT_PHONE}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.CAMPUS}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.TRACK_ID}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.TRACK}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.GPA}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.TOTAL_SKS}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.STATUS}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.PARTNER_LECTURER}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.POSITION_TOPIC}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.DURATION}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.JOB_START_DATE}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.JOB_END_DATE}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.WORK_SCHEMA}
                      </td>
                      <td className="border border-zinc-400 px-2">
                        {item.ENROLLMENT}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls flex justify-center items-center gap-x-5 py-2">
                <button onClick={handlePrevClick} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showFilterDialog && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md relative">
            {/* Close button */}
            <button
              onClick={handleCloseFilterDialog}
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
              <h3 className="text-lg font-semibold mb-2">Filter Options</h3>

              {/* Add checkboxes for each program */}
              <div>
                <h2 className="text-md font-semibold mb-2">
                  Academic Programs
                </h2>
                {programs.map((program, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="checkbox"
                      id={program}
                      checked={selectedAcads.includes(program)}
                      onChange={() => handleAcadChange(program)}
                    />
                    <label htmlFor={program} className="ml-2">
                      {program}
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2">
                  GPA Index
                </h2>
                {Object.entries(gpaCategory).map(([program, value], index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="checkbox"
                      id={program}
                      checked={selectedGpaCategories.includes(program)}
                      onChange={() => handleGpaCategoryChange(program)}
                    />
                    <label htmlFor={program} className="ml-2">
                      {value}
                    </label>
                  </div>
                
                ))}
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2">
                  Enrichment Status
                </h2>
                <select
                  id="statusSelect"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center"
                >
                  <option value="">All Status</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2">
                  Enrollment Status
                </h2>
                <select
                  id="statusSelect"
                  value={selectedEnrollment}
                  onChange={handleEnrollmentChange}
                  className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center"
                >
                  <option value="">All Status</option>
                  {enrollments.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

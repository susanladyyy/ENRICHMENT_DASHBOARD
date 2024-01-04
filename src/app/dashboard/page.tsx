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
  CampusChartData,
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
      console.log('Not Logged In!')
    }
  })

  const programs = ["Computer Science",
  "Computer Science and Mathematics",
  "Computer Science and Statistics",
  "Cyber Security",
  "Data Science",
  "Game Application and Technology",
  "Mobile Application and Technology"];

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
  const [selectedVis, setSelectedVis] = useState("Pie Chart");
  const [selectedAcad, setSelectedAcad] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSemesterChange = (event: any) => {
    setSelectedSemester(event.target.value);
  };

  const handleAreaChange = (event: any) => {
    setSelectedArea(event.target.value);
  };

  const handleVisChange = (event: any) => {
    setSelectedVis(event.target.value);
  };

  const handleAcadChange = (event: any) => {
    setSelectedAcad(event.target.value);
  };

  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  const trackDictionary = trackBarData.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]: trackData[index % trackData.length]?.name || '',
    };
  }, {});
  
  console.log(trackDictionary);

  const handleDataUpload = (data: InternshipData[]) => {
    setUploadedData(data);

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

  if(status === "loading") {
    redirect('/');
  }

  console.log(gpaPieData);
  console.log(trackData);

  useEffect(() => {
    if (selectedAcad != "") {
      const newFilteredData = uploadedData.filter(
        (item) => item.ACADEMIC_PROGRAM === selectedAcad
      );
      setFilteredData(newFilteredData);
    } else {
      setFilteredData(uploadedData);
    }
  }, [selectedAcad, uploadedData]);

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
              
                { /* semester */}
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
            {/* choose visualization */}
            <div className="mr-5 mt-5">
              <select
                id="visSelect"
                value={selectedVis}
                onChange={handleVisChange}
                className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mb-2"
              >
                <option value="Pie Chart" selected>Pie Chart</option>
                <option value="Bar Chart">Bar Chart</option>
              </select>
            </div>
            <div className="w-full flex flex-row items-center py-[2vh] gap-x-[2vh]">
              <div className="w-full rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <h2 className="text-2xl font-semibold pb-[3vh]">
                  Enrichment Track
                </h2>
                <div className="flex flex-col justify-center items-center">
                  {selectedVis === "Bar Chart" && (
                    <>
                      <BarChart width={400} height={400} data={trackBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#d12318" />
                      </BarChart>
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}>
                        {Object.entries(trackDictionary).map(([key, value]: any) => (
                          <div key={key}>
                            <p>{key}: {value}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedVis === "Pie Chart" && (
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
                <h2 className="text-2xl font-semibold pb-[3vh]">GPA Chart</h2>
                <div className="flex flex-col justify-center items-center">
                  {selectedVis === "Pie Chart" && (
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
                                    backgroundColor: gpaPieData[index].color,  // Use gpaPieData instead of trackData
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
                  
                  {selectedVis === "Bar Chart" && (
                    <BarChart width={400} height={400} data={gpaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#079bde" />
                    </BarChart>
                  )}
                  
                </div>
              </div>
            </div>
            <div className="w-full bg-white rounded-xl max-h-[70vh] overflow-scroll px-[2vw] py-[3vh]">
              <h2 className="text-2xl font-semibold pb-[3vh]">Students Data</h2>
              {/* choose visualization */}
              <div className="mr-5 mt-5">
                <select
                  id="acadSelect"
                  value={selectedAcad}
                  onChange={handleAcadChange}
                  className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center mb-2 mr-2">
                  <option value="" selected>Select Academic Program</option>

                  {programs.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <table className="table-auto border border-collapse">
                <thead>
                  <tr>
                    <th className="border border-zinc-400 min-w-full px-2">
                      BINUSIAN ID
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      STUDENT ID
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      STUDENT NAME
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      ACADEMIC PROGRAM ID
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      ACADEMIC GROUP
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      ACADEMIC PROGRAM
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      STUDENT EMAIL
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      STUDENT PHONE
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      CAMPUS
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      TRACK ID
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      TRACK
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      GPA
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      TOTAL SKS
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      STATUS
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      PARTNER/LECTURER
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      POSITION/TOPIC
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      DURATION
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      JOB START DATE
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      JOB END DATE
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      WORK SCHEMA
                    </th>
                    <th className="border border-zinc-400 min-w-full px-2">
                      ENROLLMENT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

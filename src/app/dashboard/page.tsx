"use client";

import { useState } from "react";
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
import { categorizeByGPA, countByTrack } from "../utils/chartUtils";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [uploadedData, setUploadedData] = useState<InternshipData[]>([]);
  const [trackData, setTrackData] = useState<InternshipData[]>([]);
  const [gpaData, setGpaData] = useState<InternshipData[]>([]);

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

    const newGpaData = categorizeByGPA(data);
    setGpaData(newGpaData);
  };

  const legendColors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

  return (
    <div className="flex flex-row">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-5/6 content bg-[#e1eef5] py-[3vh] px-[3vh]">
        <div className="py-[3vh] px-[3vw] bg-white flex rounded-xl">
          <div className="py-[3vh] flex flex-col gap-y-[3vh]">
            <div className="header bg-white">
              <p className="text-4xl font-bold">Dashboard</p>
            </div>
            <div>
              <Uploader onDataUpload={handleDataUpload} />
            </div>
          </div>
        </div>
        {uploadedData && uploadedData.length > 0 && (
          <div className="w-full">
            <div className="w-full flex flex-row items-center py-[2vh] gap-x-[2vh]">
              <div className="w-full rounded-xl bg-white flex justify-center items-center px-[3vw] py-[3vh]">
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
                            <span className="text-xs" style={{ color: "#000" }}>
                              {entry.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                  <Tooltip />
                </PieChart>
              </div>
              <div className="w-full rounded-xl bg-white flex justify-center items-center px-[3vw] py-[3vh]">
                {/* Recharts PieChart component */}
                <BarChart width={400} height={400} data={gpaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
            <div className="w-full bg-white rounded-xl max-h-[60vh] overflow-scroll px-[2vw] py-[3vh]">
              <h2 className="text-2xl font-semibold pb-[3vh]">Students Data</h2>
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
                  {uploadedData.map((item, index) => (
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
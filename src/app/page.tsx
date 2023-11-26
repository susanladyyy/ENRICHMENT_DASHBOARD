"use client";

import { useState } from "react";
import NavBar from "./components/NavBar";
import Uploader from "./components/Uploader";
import { InternshipData } from "./models/InternshipData";

export default function Dashboard() {
  const [uploadedData, setUploadedData] = useState<InternshipData[]>([]);

  const handleDataUpload = (data: InternshipData[]) => {
    setUploadedData(data);
  };

  return (
    <>
      <NavBar />
      <hr />
      <div className="content my-[10vh] mx-[5vw]">
        <div className="header">
          <p className="text-4xl text-bold">Dashboard</p>
        </div>
        <div className="py-[5vh]">
          <Uploader onDataUpload={handleDataUpload} />
        </div>
        <div className="w-full max-h-[60vh] overflow-auto">
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
                <th className="border border-zinc-400 min-w-full px-2">GPA</th>
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
                  <td className="border border-zinc-400 px-2">{item.CAMPUS}</td>
                  <td className="border border-zinc-400 px-2">
                    {item.TRACK_ID}
                  </td>
                  <td className="border border-zinc-400 px-2">{item.TRACK}</td>
                  <td className="border border-zinc-400 px-2">{item.GPA}</td>
                  <td className="border border-zinc-400 px-2">
                    {item.TOTAL_SKS}
                  </td>
                  <td className="border border-zinc-400 px-2">{item.STATUS}</td>
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
    </>
  );
}

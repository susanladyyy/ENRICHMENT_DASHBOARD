"use client";

import React from "react";
import { readExcelFile } from "../utils/readExcelFile";
import { InternshipData } from "../models/InternshipData";

interface UploaderProps {
  onDataUpload: (data: InternshipData[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onDataUpload }) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const excelData = await readExcelFile(file);

        const processedData = excelData.slice(1).map((item) => {
          return {
            BINUSIAN_ID: item[0],
            STUDENT_ID: item[1],
            STUDENT_NAME: item[2],
            ACADEMIC_PROGRAM_ID: item[3],
            ACADEMIC_GROUP: item[4],
            ACADEMIC_PROGRAM: item[5],
            STUDENT_EMAIL: item[6],
            STUDENT_PHONE: item[7],
            CAMPUS: item[8],
            TRACK_ID: item[9],
            TRACK: item[10],
            GPA: item[11],
            TOTAL_SKS: item[12],
            STATUS: item[13],
            PARTNER_LECTURER: item[14],
            POSITION_TOPIC: item[15],
            DURATION: item[16],
            JOB_START_DATE: item[17],
            JOB_END_DATE: item[18],
            WORK_SCHEMA: item[19],
            ENROLLMENT: item[20],
          };
        });

        console.log(processedData);

        onDataUpload(processedData);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default Uploader;

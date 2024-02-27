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
  LineChart,
  Line,
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
import { BarData, LineData, PieData } from "../types/ChartData";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Not Logged In!");
    },
  });

  const tracks = [
    "Certified Internship",
    "Certified Community Development",
    "Certified Research",
    "Certified Study Abroad",
    "Certified Specific Independent Study",
    "Certified Entrepreneurship",
  ];

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
  const [trackLineData, setTrackLineData] = useState<LineData[]>([]);
  const [gpaData, setGpaData] = useState<BarData[]>([]);
  const [gpaPieData, setGpaPieData] = useState<PieData[]>([]);
  const [campusData, setCampusData] = useState<Record<string, number>>();
  const [studentPieData, setStudentPieData] = useState<PieData[]>([]);
  const [studentBarData, setStudentBarData] = useState<BarData[]>([]);
  const [studentLineData, setStudentLineData] = useState<LineData[]>([]);
  const [campusPieData, setCampusPieData] = useState<PieData[]>([]);
  const [campusBarData, setCampusBarData] = useState<BarData[]>([]);
  const [campusLineData, setCampusLineData] = useState<LineData[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [topCompanies, setTopCompanies] = useState<PieData[]>([]);
  const [topCompaniesBar, setTopCompaniesBar] = useState<BarData[]>([]);
  const [topCompaniesLine, setTopCompaniesLine] = useState<LineData[]>([]);
  const [topPositions, setTopPositions] = useState<PieData[]>([]);
  const [topPositionsBar, setTopPositionsBar] = useState<BarData[]>([]);
  const [topPositionsLine, setTopPositionsLine] = useState<LineData[]>([]);

  const [selectedTrackVis, setSelectedTrackVis] = useState("Pie Chart");
  const [selectedGPAVis, setSelectedGPAVis] = useState("Pie Chart");
  const [selectedStudentVis, setSelectedStudentVis] = useState("Pie Chart");
  const [selectedCampusVis, setSelectedCampusVis] = useState("Pie Chart");
  const [selectedCompanyVis, setSelectedCompanyVis] = useState("Line Chart");
  const [selectedPositionVis, setSelectedPositionVis] = useState("Line Chart");

  const [trackByProgram, setTrackByProgram] = useState("All Programs");
  const [gpaByProgram, setGpaByProgram] = useState("All Programs");
  const [companyByProgram, setCompanyByProgram] = useState("All Programs");
  const [positionByProgram, setPositionByProgram] = useState("All Programs");
  const [gpaByTrack, setGpaByTrack] = useState("All Tracks");

  const [showTrackFilterDialog, setShowTrackFilterDialog] = useState(false);
  const [showGPAFilterDialog, setShowGPAFilterDialog] = useState(false);
  const [showStudentFilterDialog, setShowStudentFilterDialog] = useState(false);
  const [showCampusFilterDialog, setShowCampusFilterDialog] = useState(false);
  const [showCompanyFilterDialog, setShowCompanyFilterDialog] = useState(false);
  const [showPositionFilterDialog, setShowPositionFilterDialog] =
    useState(false);

  const [companyDictionary, setCompanyDictionary] = useState([""]);
  const [positionDictionary, setPositionDictionary] = useState([""]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FFA5A5",
    "#00BFFF",
    "#FF6347",
    "#FF69B4",
    "#90EE90",
  ];

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

  const handleCompanyVisChange = (event: any) => {
    setSelectedCompanyVis(event.target.value);
  };

  const handleCampusVisChange = (event: any) => {
    setSelectedCampusVis(event.target.value);
  };

  const handlePositionVisChange = (event: any) => {
    setSelectedPositionVis(event.target.value);
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

    // Calculate new track data
    const newTrackData = Object.keys(countByTrack(filteredData)).map(
      (track, index) => ({
        name: track,
        value: countByTrack(filteredData)[track],
        color: COLORS[index % COLORS.length],
      })
    );

    // Calculate new track bar data
    const newTrackBarData = Object.keys(countByTrackID(filteredData)).map(
      (id, index) => ({
        category: id,
        count: countByTrackID(filteredData)[id],
        color: COLORS[index % COLORS.length],
      })
    );

    // Update state variables
    setTrackData(newTrackData);
    setTrackBarData(newTrackBarData);
  };

  useEffect(() => {
    // Filter the uploaded data based on the selected program
    let filteredData =
      gpaByProgram === "All Programs"
        ? uploadedData
        : uploadedData.filter((item) => item.ACADEMIC_PROGRAM === gpaByProgram);

    // Filter the uploaded data based on the selected program
    filteredData =
      gpaByTrack === "All Tracks"
        ? filteredData
        : filteredData.filter((item) => item.TRACK === gpaByTrack);

    const newGpaPieData = categorizeByGPAPie(filteredData);
    setGpaPieData(newGpaPieData);

    const newGpaData = categorizeByGPA(filteredData);
    setGpaData(newGpaData);
  });

  const handleGPAProgramChange = (event: any) => {
    const selectedProgram = event.target.value;
    setGpaByProgram(selectedProgram);
  };

  const handleGPATrackChange = (event: any) => {
    const selectedTrack = event.target.value;
    setGpaByTrack(selectedTrack);
  };

  const handleCompanyTrackChange = (event: any) => {
    setCompanyByProgram(event.target.value);

    if (event.target.value === "All Programs") {
      countCompanies(uploadedData);
    } else {
      countCompaniesByProgram(uploadedData, event.target.value);
    }
  };

  const handlePositionTrackChange = (event: any) => {
    setPositionByProgram(event.target.value);

    if (event.target.value === "All Programs") {
      countPositions(uploadedData);
    } else {
      countPositionsByProgram(uploadedData, event.target.value);
    }
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

  const handleCompanyFilterClick = () => {
    setShowCompanyFilterDialog(true);
  };

  const handlePositionFilterClick = () => {
    setShowPositionFilterDialog(true);
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

  const handleCloseCompanyFilterDialog = () => {
    setShowCompanyFilterDialog(false);
  };

  const handleClosePositionFilterDialog = () => {
    setShowPositionFilterDialog(false);
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

  const campusDictionary = campusBarData.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]: campusPieData[index % campusPieData.length]?.name || "",
    };
  }, {});

  const compDictionary = topCompaniesBar.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]:
        companyDictionary[index % companyDictionary.length] || "",
    };
  }, {});

  const posDictionary = topPositionsBar.reduce((acc, entry, index) => {
    return {
      ...acc,
      [entry.category]:
        positionDictionary[index % positionDictionary.length] || "",
    };
  }, {});

  function getInitialsOfWords(input: string): string {
    const words = input.trim().split(" ");

    const initials = words.map((word) => word.charAt(0).toUpperCase());

    return initials.join("");
  }

  const countCompanies = (uploaded: InternshipData[]) => {
    const companyCountMap: Record<string, number> = {};

    uploaded.forEach((entry) => {
      const company = entry.PARTNER_LECTURER;
      const trackId = entry.TRACK_ID;

      if (
        company !== "-" &&
        company.toLowerCase().includes("bina nusantara") === false &&
        company.toLowerCase().includes("binus") === false &&
        company !== undefined &&
        trackId === "IN"
      ) {
        companyCountMap[company] = (companyCountMap[company] || 0) + 1;
      }
    });

    // Step 2: Sort the companies based on count in descending order
    const sortedCompanies = Object.keys(companyCountMap).sort(
      (a, b) => companyCountMap[b] - companyCountMap[a]
    );

    // Step 3: Select the top 10 companies
    const top10Companies = sortedCompanies.slice(0, 10);
    setCompanyDictionary(top10Companies);

    const top10Pie = sortedCompanies.slice(0, 10).map((company, index) => ({
      name: company,
      value: companyCountMap[company],
      color: COLORS[index % COLORS.length],
    }));

    const top10Bar = sortedCompanies.slice(0, 10).map((company, index) => {
      // Remove words inside parentheses including the parentheses
      let cleanedCompany = company.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedCompany.includes("PT")) {
        cleanedCompany = cleanedCompany.replace("PT. ", "");
      }

      const category: string = getInitialsOfWords(cleanedCompany);

      return {
        category,
        count: companyCountMap[company],
        color: COLORS[index % COLORS.length],
      };
    });

    const top10Line = sortedCompanies.slice(0, 10).map((company) => {
      // Remove words inside parentheses including the parentheses
      let cleanedCompany = company.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedCompany.includes("PT")) {
        cleanedCompany = cleanedCompany.replace("PT. ", "");
      }

      const name: string = getInitialsOfWords(cleanedCompany);

      return {
        name,
        count: companyCountMap[company],
      };
    });

    setTopCompanies(top10Pie);
    setTopCompaniesBar(top10Bar);
    setTopCompaniesLine(top10Line);
  };

  const countCompaniesByProgram = (
    uploaded: InternshipData[],
    selectedProgram: string
  ) => {
    const companyCountMap: Record<string, number> = {};

    uploaded.forEach((entry) => {
      const company = entry.PARTNER_LECTURER;
      const academicProgram = entry.ACADEMIC_PROGRAM;

      if (
        company !== "-" &&
        company.includes("Binus") === false &&
        company !== undefined &&
        academicProgram === selectedProgram
      ) {
        companyCountMap[company] = (companyCountMap[company] || 0) + 1;
      }
    });

    // Step 2: Sort the companies based on count in descending order
    const sortedCompanies = Object.keys(companyCountMap).sort(
      (a, b) => companyCountMap[b] - companyCountMap[a]
    );

    // Step 3: Select the top 10 companies
    const top10Companies = sortedCompanies.slice(0, 10);
    setCompanyDictionary(top10Companies);

    const top10Pie = sortedCompanies.slice(0, 10).map((company, index) => ({
      name: company,
      value: companyCountMap[company],
      color: COLORS[index % COLORS.length],
    }));

    const top10Bar = sortedCompanies.slice(0, 10).map((company, index) => {
      // Remove words inside parentheses including the parentheses
      let cleanedCompany = company.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedCompany.includes("PT")) {
        cleanedCompany = cleanedCompany.replace("PT. ", "");
      }

      const category: string = getInitialsOfWords(cleanedCompany);

      return {
        category,
        count: companyCountMap[company],
        color: COLORS[index % COLORS.length],
      };
    });

    const top10Line = sortedCompanies.slice(0, 10).map((company) => {
      // Remove words inside parentheses including the parentheses
      let cleanedCompany = company.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedCompany.includes("PT")) {
        cleanedCompany = cleanedCompany.replace("PT. ", "");
      }

      const name: string = getInitialsOfWords(cleanedCompany);

      return {
        name,
        count: companyCountMap[company],
      };
    });

    setTopCompanies(top10Pie);
    setTopCompaniesBar(top10Bar);
    setTopCompaniesLine(top10Line);
  };

  const countPositions = (uploaded: InternshipData[]) => {
    const positionCountMap: Record<string, number> = {};

    uploaded.forEach((entry) => {
      const position = entry.POSITION_TOPIC;
      const trackId = entry.TRACK_ID;

      if (position !== "-" && position !== undefined && trackId == "IN") {
        positionCountMap[position] = (positionCountMap[position] || 0) + 1;
      }
    });

    // Step 2: Sort the Positions based on count in descending order
    const sortedPositions = Object.keys(positionCountMap).sort(
      (a, b) => positionCountMap[b] - positionCountMap[a]
    );

    // Step 3: Select the top 10 Positions
    const top10Positions = sortedPositions.slice(0, 10);
    setPositionDictionary(top10Positions);

    const top10Pie = sortedPositions.slice(0, 10).map((position, index) => ({
      name: position,
      value: positionCountMap[position],
      color: COLORS[index % COLORS.length],
    }));

    const top10Bar = sortedPositions.slice(0, 10).map((position, index) => {
      // Remove words inside parentheses including the parentheses
      let cleanedPosition = position.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedPosition.includes("PT")) {
        cleanedPosition = cleanedPosition.replace("PT. ", "");
      }

      const category: string = getInitialsOfWords(cleanedPosition);

      return {
        category,
        count: positionCountMap[position],
        color: COLORS[index % COLORS.length],
      };
    });

    const top10Line = sortedPositions.slice(0, 10).map((position) => {
      // Remove words inside parentheses including the parentheses
      let cleanedPosition = position.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedPosition.includes("PT")) {
        cleanedPosition = cleanedPosition.replace("PT. ", "");
      }

      const name: string = getInitialsOfWords(cleanedPosition);

      return {
        name,
        count: positionCountMap[position],
      };
    });

    setTopPositions(top10Pie);
    setTopPositionsBar(top10Bar);
    setTopPositionsLine(top10Line);
  };

  const countPositionsByProgram = (
    uploaded: InternshipData[],
    acad: string
  ) => {
    const positionCountMap: Record<string, number> = {};

    uploaded.forEach((entry) => {
      const position = entry.POSITION_TOPIC;
      const academicProgram = entry.ACADEMIC_PROGRAM;
      if (
        position !== "-" &&
        position !== undefined &&
        academicProgram === acad
      ) {
        positionCountMap[position] = (positionCountMap[position] || 0) + 1;
      }
    });

    // Step 2: Sort the Positions based on count in descending order
    const sortedPositions = Object.keys(positionCountMap).sort(
      (a, b) => positionCountMap[b] - positionCountMap[a]
    );

    // Step 3: Select the top 10 Positions
    const top10Positions = sortedPositions.slice(0, 10);
    setPositionDictionary(top10Positions);

    const top10Pie = sortedPositions.slice(0, 10).map((position, index) => ({
      name: position,
      value: positionCountMap[position],
      color: COLORS[index % COLORS.length],
    }));

    const top10Bar = sortedPositions.slice(0, 10).map((position, index) => {
      // Remove words inside parentheses including the parentheses
      let cleanedPosition = position.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedPosition.includes("PT")) {
        cleanedPosition = cleanedPosition.replace("PT. ", "");
      }

      const category: string = getInitialsOfWords(cleanedPosition);

      return {
        category,
        count: positionCountMap[position],
        color: COLORS[index % COLORS.length],
      };
    });

    const top10Line = sortedPositions.slice(0, 10).map((position) => {
      // Remove words inside parentheses including the parentheses
      let cleanedPosition = position.replace(/\s*\([^)]*\)\s*/g, "");

      // Remove 'PT.' if present and get initials of words
      if (cleanedPosition.includes("PT")) {
        cleanedPosition = cleanedPosition.replace("PT. ", "");
      }

      const name: string = getInitialsOfWords(cleanedPosition);

      return {
        name,
        count: positionCountMap[position],
      };
    });

    setTopPositions(top10Pie);
    setTopPositionsBar(top10Bar);
    setTopPositionsLine(top10Line);
  };

  const handleDataUpload = (data: InternshipData[]) => {
    setUploadedData(data);

    countCompanies(data);

    countPositions(data);

    const newProgramPieData = Object.keys(countByProgram(data)).map(
      (program, index) => ({
        name: program,
        value: countByProgram(data)[program],
        color: COLORS[index % COLORS.length],
      })
    );
    setStudentPieData(newProgramPieData);

    const newProgramBarData = Object.keys(countByProgram(data)).map(
      (program, index) => ({
        category: getInitialsOfWords(program),
        count: countByProgram(data)[program],
        color: COLORS[index % COLORS.length],
      })
    );

    setStudentBarData(newProgramBarData);

    const newProgramLineData = Object.keys(countByProgram(data)).map(
      (program, index) => ({
        name: getInitialsOfWords(program),
        count: countByProgram(data)[program],
      })
    );

    setStudentLineData(newProgramLineData);

    const newCampusPieData = Object.keys(countByCampus(data)).map(
      (campus, index) => ({
        name: campus,
        value: countByCampus(data)[campus],
        color: COLORS[index % COLORS.length],
      })
    );
    setCampusPieData(newCampusPieData);

    const newCampusBarData = Object.keys(countByCampus(data)).map(
      (campus, index) => ({
        category: getInitialsOfWords(campus),
        count: countByCampus(data)[campus],
        color: COLORS[index % COLORS.length],
      })
    );

    setCampusBarData(newCampusBarData);

    const newCampusLineData = Object.keys(countByCampus(data)).map(
      (campus, index) => ({
        name: getInitialsOfWords(campus),
        count: countByCampus(data)[campus],
      })
    );

    setCampusLineData(newCampusLineData);

    const newTrackData = Object.keys(countByTrack(data)).map(
      (track, index) => ({
        name: track,
        value: countByTrack(data)[track],
        color: COLORS[index % COLORS.length],
      })
    );

    setTrackData(newTrackData);

    const newTrackBarData = Object.keys(countByTrackID(data)).map(
      (id, index) => ({
        category: id,
        count: countByTrackID(data)[id],
        color: COLORS[index % COLORS.length],
      })
    );
    setTrackBarData(newTrackBarData);

    const newTrackLineData = Object.keys(countByTrackID(data)).map(
      (id, index) => ({
        name: id,
        count: countByTrackID(data)[id],
      })
    );
    setTrackLineData(newTrackLineData);

    const newGpaPieData = categorizeByGPAPie(data);
    setGpaPieData(newGpaPieData);

    const newGpaData = categorizeByGPA(data);
    setGpaData(newGpaData);

    const campusCounts = countByCampus(data);
    setCampusData(campusCounts);
  };

  if (status === "loading") {
    redirect("/");
  }

  console.log(topCompanies);
  console.log(topCompaniesBar);
  console.log(topCompaniesLine);

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

                  {selectedStudentVis === "Line Chart" && (
                    <>
                      <LineChart
                        width={600}
                        height={300}
                        data={studentLineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                        />
                      </LineChart>

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
                    </>
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

                  {selectedCampusVis === "Line Chart" && (
                    <>
                      <LineChart
                        width={600}
                        height={300}
                        data={campusLineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                        />
                      </LineChart>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "20px",
                        }}
                      >
                        {Object.entries(campusDictionary).map(
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

            {/* top 10 companies */}
            <div className="w-full flex flex-row items-stretch py-[2vh] gap-x-[2vh]">
              <div className="w-full flex-1 rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-start">
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold">Top 10 Companies</h2>
                    {companyByProgram !== "All Programs" && (
                      <p>by {companyByProgram}</p>
                    )}
                  </div>
                  <button
                    onClick={handleCompanyFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
                  {selectedCompanyVis === "Bar Chart" &&
                    topCompaniesBar.length === 0 && (
                      <div>No Data on {companyByProgram}</div>
                    )}

                  {selectedCompanyVis === "Bar Chart" &&
                    topCompaniesBar.length !== 0 && (
                      <div className="py-6">
                        <BarChart
                          width={1200}
                          height={500}
                          data={topCompaniesBar}
                        >
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
                            marginLeft: "50px",
                          }}
                        >
                          {Object.entries(compDictionary).map(
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

                  {selectedCompanyVis === "Pie Chart" &&
                    topCompanies.length === 0 && (
                      <div>No Data on {companyByProgram}</div>
                    )}

                  {selectedCompanyVis === "Pie Chart" &&
                    topCompanies.length !== 0 && (
                      <PieChart width={500} height={600}>
                        {/* Data for the pie chart */}
                        <Pie
                          data={topCompanies}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label
                          dataKey="value"
                        >
                          {/* Customizing the colors of each sector */}
                          {topCompanies.map((entry, index) => (
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
                                alignItems: "center",
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
                                      topCompanies.find(
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

                  {selectedCompanyVis === "Line Chart" &&
                    topCompaniesLine.length === 0 && (
                      <div>No Data on {companyByProgram}</div>
                    )}

                  {selectedCompanyVis === "Line Chart" &&
                    topCompaniesLine.length !== 0 && (
                      <>
                        <LineChart
                          width={1300}
                          height={300}
                          data={topCompaniesLine}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                          />
                        </LineChart>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "20px",
                          }}
                        >
                          {Object.entries(compDictionary).map(
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

                  {selectedTrackVis === "Line Chart" && (
                    <>
                      <LineChart
                        width={600}
                        height={300}
                        data={trackLineData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                        />
                      </LineChart>

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

                  {selectedGPAVis === "Line Chart" && (
                    <>
                      <LineChart
                        width={600}
                        height={300}
                        data={gpaData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="category" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                        />
                      </LineChart>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* top 10 Positions */}
            <div className="w-full flex flex-row items-stretch py-[2vh] gap-x-[2vh]">
              <div className="w-full flex-1 rounded-xl bg-white flex flex-col px-[3vw] py-[3vh]">
                <div className="w-full flex flex-row justify-between items-start">
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <h2 className="text-2xl font-semibold">Top 10 Positions</h2>
                    {/* <p>by Academic Program</p> */}
                  </div>
                  <button
                    onClick={handlePositionFilterClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Modify
                  </button>
                </div>
                <div className="flex-1 h-full w-full flex flex-col justify-center items-center">
                  {selectedPositionVis === "Bar Chart" &&
                    topPositionsBar.length === 0 && (
                      <div>No Data on {positionByProgram}</div>
                    )}

                  {selectedPositionVis === "Bar Chart" &&
                    topPositionsBar.length !== 0 && (
                      <div className="py-6">
                        <BarChart
                          width={1200}
                          height={500}
                          data={topPositionsBar}
                        >
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
                            marginLeft: "50px",
                          }}
                        >
                          {Object.entries(posDictionary).map(
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

                  {selectedPositionVis === "Pie Chart" &&
                    topPositions.length === 0 && (
                      <div>No Data on {positionByProgram}</div>
                    )}

                  {selectedPositionVis === "Pie Chart" &&
                    topPositions.length !== 0 && (
                      <PieChart width={400} height={500}>
                        {/* Data for the pie chart */}
                        <Pie
                          data={topPositions}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label
                          dataKey="value"
                        >
                          {/* Customizing the colors of each sector */}
                          {topPositions.map((entry, index) => (
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
                                      topPositions.find(
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

                  {selectedPositionVis === "Line Chart" &&
                    topPositionsLine.length === 0 && (
                      <div>No Data on {positionByProgram}</div>
                    )}

                  {selectedPositionVis === "Line Chart" &&
                    topPositionsLine.length !== 0 && (
                      <>
                        <LineChart
                          width={1300}
                          height={300}
                          data={topPositionsLine}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                          />
                        </LineChart>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "20px",
                          }}
                        >
                          {Object.entries(posDictionary).map(
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
                        <option value="Line Chart">Line Chart</option>
                      </select>
                    </div>

                    {selectedTrackVis !== "Line Chart" && (
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
                    )}
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
                        <option value="Line Chart">Line Chart</option>
                      </select>
                    </div>

                    {selectedGPAVis !== "Line Chart" && (
                      <div>
                        <div>
                          <h2 className="text-md font-semibold mb-2">
                            Filter by Academic Program
                          </h2>
                          <select
                            id="gpaByProgramSelect"
                            value={gpaByProgram}
                            onChange={handleGPAProgramChange}
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
                        <div>
                          <h2 className="text-md font-semibold mb-2">
                            Filter by Track
                          </h2>
                          <select
                            id="gpaByTrackSelect"
                            value={gpaByTrack}
                            onChange={handleGPATrackChange}
                            className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                          >
                            <option value="All Tracks">All Tracks</option>

                            {tracks.map((track, index) => (
                              <option key={index} value={track}>
                                {track}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showCompanyFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleCloseCompanyFilterDialog}
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
                        value={selectedCompanyVis}
                        onChange={handleCompanyVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                        <option value="Line Chart">Line Chart</option>
                      </select>
                    </div>

                    {selectedCompanyVis !== "Line Chart" && (
                      <div>
                        <h2 className="text-md font-semibold mb-2">
                          Filter by Academic Program
                        </h2>
                        <select
                          id="visSelect"
                          value={companyByProgram}
                          onChange={handleCompanyTrackChange}
                          className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                        >
                          <option value="All Programs">All Programs</option>

                          {programs.map((program, index) =>
                            companyByProgram === program ? (
                              <option key={index} value={program} selected>
                                {program}
                              </option>
                            ) : (
                              <option key={index} value={program}>
                                {program}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
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
                        <option value="Line Chart">Line Chart</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showPositionFilterDialog && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-1/4 p-8 rounded-md relative">
                  {/* Close button */}
                  <button
                    onClick={handleClosePositionFilterDialog}
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
                        value={selectedPositionVis}
                        onChange={handlePositionVisChange}
                        className="border border-solid border-black text-black bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 inline-flex items-center mb-2"
                      >
                        <option value="Pie Chart">Pie Chart</option>
                        <option value="Bar Chart">Bar Chart</option>
                        <option value="Line Chart">Line Chart</option>
                      </select>
                    </div>

                    {selectedPositionVis !== "Line Chart" && (
                      <div>
                        <h2 className="text-md font-semibold mb-2">
                          Filter by Academic Program
                        </h2>
                        <select
                          id="visSelect"
                          value={positionByProgram}
                          onChange={handlePositionTrackChange}
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
                    )}
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
                        <option value="Line Chart">Line Chart</option>
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

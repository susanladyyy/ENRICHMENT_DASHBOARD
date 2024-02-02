// chartUtils.ts

import { InternshipData } from "../models/InternshipData";
import { GpaChartData, GpaPieData, TrackBarData, TrackChartData } from "../types/ChartData";

export const countByTrack = (
  data: InternshipData[]
): Record<string, number> => {
  const trackCounts = {};

  data.forEach((item) => {
    const track = item.TRACK;
    trackCounts[track] = (trackCounts[track] || 0) + 1;
  });

  return trackCounts;
};

export const countByTrackID = (
  data: InternshipData[]
): Record<string, number> => {
  const idCounts = {};

  data.forEach((item) => {
    const id = item.TRACK_ID;
    idCounts[id] = (idCounts[id] || 0) + 1;
  });

  return idCounts;
};

export const categorizeByGPA = (data: InternshipData[]): GpaChartData[] => {
  const categorizedData = {
    "C": 0,
    "MC": 0,
    "SC": 0,
  };

  data.forEach((item) => {
    const gpa = parseFloat(item.GPA);
    if (gpa >= 3.5 && gpa <= 3.79) {
      categorizedData["C"] += 1;
    } else if (gpa >= 3.8 && gpa <= 3.99) {
      categorizedData["MC"] += 1;
    } else {
      categorizedData["SC"] += 1;
    }
  });

  return Object.keys(categorizedData).map((category) => ({
    category,
    count: categorizedData[category],
  }));
};

export const categorizeByGPAPie = (data: InternshipData[]): GpaPieData[] => {
  const categorizedData = {
    "Cumlaude (3.50 - 3.79)": 0,
    "Magma Cumlaude (3.80 - 3.99)": 0,
    "Summa Cumlaude (4.00)": 0,
  };

  const colors = {
    "Cumlaude (3.50 - 3.79)": "#079bde",
    "Magma Cumlaude (3.80 - 3.99)": "#d12318",
    "Summa Cumlaude (4.00)": "#f08700",
  };

  data.forEach((item) => {
    const gpa = parseFloat(item.GPA);
    if (gpa < 2.5) {
      categorizedData["Cumlaude (3.50 - 3.79)"] += 1;
    } else if (gpa >= 2.5 && gpa <= 3) {
      categorizedData["Magma Cumlaude (3.80 - 3.99)"] += 1;
    } else if(gpa == 4.0) {
      categorizedData["Summa Cumlaude (4.00)"] += 1;
    }
  });

  return Object.keys(categorizedData).map((name) => ({
    name,
    value: categorizedData[name],
    color: colors[name],
  }));
};

export const countByCampus = (
  data: InternshipData[]
): Record<string, number> => {
  const campusCounts: Record<string, number> = {};

  data.forEach((item) => {
    const campus = item.CAMPUS;
    campusCounts[campus] = (campusCounts[campus] || 0) + 1;
  });

  return campusCounts;
};

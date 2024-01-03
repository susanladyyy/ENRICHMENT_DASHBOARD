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
    "<2.5": 0,
    "2.5-3": 0,
    ">3": 0,
  };

  data.forEach((item) => {
    const gpa = parseFloat(item.GPA);
    if (gpa < 2.5) {
      categorizedData["<2.5"] += 1;
    } else if (gpa >= 2.5 && gpa <= 3) {
      categorizedData["2.5-3"] += 1;
    } else {
      categorizedData[">3"] += 1;
    }
  });

  return Object.keys(categorizedData).map((category) => ({
    category,
    count: categorizedData[category],
  }));
};

export const categorizeByGPAPie = (data: InternshipData[]): GpaPieData[] => {
  const categorizedData = {
    "<2.5": 0,
    "2.5-3": 0,
    ">3": 0,
  };

  const colors = {
    "<2.5": "#079bde",
    "2.5-3": "#d12318",
    ">3": "#f08700",
  };

  data.forEach((item) => {
    const gpa = parseFloat(item.GPA);
    if (gpa < 2.5) {
      categorizedData["<2.5"] += 1;
    } else if (gpa >= 2.5 && gpa <= 3) {
      categorizedData["2.5-3"] += 1;
    } else {
      categorizedData[">3"] += 1;
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

// chartUtils.ts

import { InternshipData } from "../models/InternshipData";
import { GpaChartData } from "../types/ChartData";

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

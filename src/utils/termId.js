import * as LOGIN_ENUM from "@/modules/login/enum";

export const FALL_TERM = "1";
export const SPRING_TERM = "2";

export const TermMap = {
  秋季: FALL_TERM,
  春季: SPRING_TERM,
};

// termId的格式为 202401 代表2024年秋季
export const generateDefaultTermId = () => {
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1;
  // 是否属于春季
  let isSpring = currentMonth >= 2 && currentMonth <= 8;
  let year = new Date().getFullYear();
  // 秋季
  if (isSpring) {
    return [year, SPRING_TERM].join("");
  }

  return [year, FALL_TERM].join("");
};

export const validateTermId = (termId) => {
  try {
    if (!termId) return false;

    const year = termId.slice(0, 4);
    const quarter = termId.slice(4);

    if (year && quarter.length === 1) {
      return true;
    }
  } catch (e) {
    console.log("termId解析出错");
  }
  return false;
};

// termId格式为:
export const getTermId = (termId, userType) => {
  if (!termId) {
    termId = generateDefaultTermId();
  }
  if (!validateTermId(termId)) {
    return null;
  }

  return termId;
};

export const transformTermIdWithZero = (termId) => {
  const year = termId.slice(0, 4);
  const quarter = termId.slice(4);

  let newQuarter = "";
  if (quarter.length === 1) {
    newQuarter = `0${quarter}`;
  } else if (quarter.length === 2) {
    newQuarter = quarter;
  } else {
    console.log("query出错");
    newQuarter = quarter;
  }
  return [year, newQuarter].join("");
};

//将开学日期转化为termID
export function convertDateToSemester(dateStr) {
  // 先根据不同系统的日期格式将日期字符串拆分为年、月、日
  let parts;
  if (dateStr.includes(".")) {
    parts = dateStr.split(".");
  } else if (dateStr.includes("/")) {
    parts = dateStr.split("/");
  } else {
    throw new Error("日期格式不正确，请使用 YYYY.MM.DD 或 YYYY/MM/DD 格式。");
  }

  // 提取年和月
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);

  // 判断学期
  let semester;
  if (month < 6) {
    semester = 2;
    // 对于 2 月份开学的，学年要减 1
    return (year - 1).toString() + semester.toString();
  } else {
    semester = 1;
    return year.toString() + semester.toString();
  }
}

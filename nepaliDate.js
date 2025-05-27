// Nepali calendar data (BS years and their corresponding days in months)
const nepaliCalendarData = {
  2080: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2083: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2084: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
};

// Nepali month names
const nepaliMonths = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

// Convert English date to Nepali date
const convertToNepaliDate = (englishDate) => {
  const date = new Date(englishDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Base Nepali date (April 13, 2023 = Baisakh 1, 2080)
  const baseEnglishDate = new Date(2023, 3, 13); // April 13, 2023
  const baseNepaliYear = 2080;
  const baseNepaliMonth = 0; // Baisakh
  const baseNepaliDay = 1;

  // Calculate days difference
  const diffTime = Math.abs(date - baseEnglishDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate Nepali date
  let nepaliYear = baseNepaliYear;
  let nepaliMonth = baseNepaliMonth;
  let nepaliDay = baseNepaliDay;
  let remainingDays = diffDays;

  // Add days to get Nepali date
  while (remainingDays > 0) {
    const daysInMonth = nepaliCalendarData[nepaliYear][nepaliMonth];
    if (nepaliDay + remainingDays > daysInMonth) {
      remainingDays -= daysInMonth - nepaliDay + 1;
      nepaliDay = 1;
      nepaliMonth++;
      if (nepaliMonth > 11) {
        nepaliMonth = 0;
        nepaliYear++;
      }
    } else {
      nepaliDay += remainingDays;
      remainingDays = 0;
    }
  }

  // Format the date
  const monthName = nepaliMonths[nepaliMonth];
  return `${monthName} ${nepaliDay}, ${nepaliYear}`;
};

// Export the conversion function
export { convertToNepaliDate };

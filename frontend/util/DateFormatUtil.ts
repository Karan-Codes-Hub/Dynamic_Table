import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


const INVALID_DATE = "Invalid Date"

const DateFormatUtil = {

formatStringDateToAnotherFormat(
  dateString: string | number | Date | null | undefined,
  fromDateFormat = "",
  toDataFormat = "DD-MM-YYYY" // <-- Use dashes here
): string | null {
  if (!dateString) {
    return null;
  }

  let formattedDate = "";

  if (fromDateFormat) {
    formattedDate = dayjs(dateString, fromDateFormat).format(toDataFormat);
  } else {
    formattedDate = dayjs(dateString).format(toDataFormat);
  }

  if (formattedDate === "Invalid Date") {
    return null;
  }

  return formattedDate;
},

  completeDateAndTimeConvertor(
    date: Date | string | undefined
  ): string | undefined {
    if (!date) {
      return undefined;
    }

    const inputDate = new Date(date);

    const dateOptions: Intl.DateTimeFormatOptions = { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    };
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: "numeric", 
      minute: "numeric", 
      hour12: true 
    };

    // Format the date and time separately
    const formattedDate = inputDate.toLocaleString("en-US", dateOptions);
    const formattedTime = inputDate.toLocaleString("en-US", timeOptions);

    return `${formattedDate} ${formattedTime}`;
  },

  getCurrentDateAsString(
    toDataFormat = "DD MM YYYY"
  ): string | null {
    return dayjs(new Date()).format(toDataFormat);
  },

  getCurrentDate(): Date {
    return new Date();
  },

  convertToDate(
    dateString: string | number | Date | null | undefined,
    fromDateFormat = ""
  ): Date | null {
    if (!dateString) {
      return null;
    }

    const parsed = fromDateFormat
      ? dayjs(dateString, fromDateFormat)
      : dayjs(dateString);

    return parsed.isValid() ? parsed.toDate() : null;
  },

  formatDateForDocuments(dateInput: Date | string | null): string | null {
    if (dateInput === null || dateInput === '') {
        return null;
    }
    const dateObject = new Date(dateInput);
    if (isNaN(dateObject.getTime())) {
        return null;
    }
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getUTCDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
},

getPreviousDateFromToday(value: number | string | undefined): string | null {
  const today = dayjs();

  switch (value) {
    case 1: // Immediate (Due today)
      return today.subtract(0, "day").format("YYYY-MM-DDT23:59:59");

    case 2: // Tomorrow → 1 day before today
      return today.subtract(1, "day").format("YYYY-MM-DDT23:59:59");

    case 3: // This Week → assume 6 days ago
      return today.subtract(6, "day").format("YYYY-MM-DDT23:59:59");

    case 4: // Next Week → assume 13 days ago
      return today.subtract(13, "day").format("YYYY-MM-DDT23:59:59");

      case 5: // Custom
      default:
        return null;
    }
  },

convertUtcToLocal(timestamp: string) {
  const utcDate = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',               // "long" is valid
    day: 'numeric',              // "numeric" is valid
    weekday: 'long',             // must be "narrow" | "short" | "long"
    hour: '2-digit',             // must be "2-digit" or "numeric"
    minute: '2-digit',           // must be "2-digit" or "numeric"
    hour12: true
  };

  const formattedTime = utcDate.toLocaleString('en-US', options);

  return formattedTime;
},


  arrayToDateConvertor (arr)  {
    if (arr === undefined) return "";
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${arr[2]}-${month[arr[1] - 1]}-${arr[0]}`;
  }
  
};

export default DateFormatUtil;
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const toReadableDate = (isoString: Date | string): string => {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertToTimeAgo = (timestamp: Date) => {
  return dayjs(timestamp).fromNow();
};

export { toReadableDate, convertToTimeAgo };

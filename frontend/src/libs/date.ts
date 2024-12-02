import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const FLIGHT_TIME_FORMAT = 'YY/MM/DD HH:MM';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: Date | string, dateFormat: string) => {
  return dayjs(date).format(dateFormat);
};

export const formatDateToFlightFormat = (date?: Date | string) =>
  date ? formatDate(date, FLIGHT_TIME_FORMAT) : null;

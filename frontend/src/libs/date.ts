import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: Date | string, dateFormat: string) => {
  return dayjs(date).format(dateFormat);
};

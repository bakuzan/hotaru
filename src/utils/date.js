import Strings from '@/constants/strings';
import { padNumber } from './index';

const formatTime = (date) =>
  date
    ? `${padNumber(new Date(date).getHours(), 2)}:${padNumber(
        new Date(date).getMinutes(),
        2
      )}`
    : '';

export const formatDateForDisplay = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${padNumber(d.getDate(), 2)} ${
    Strings.monthNames[d.getMonth()]
  } ${d.getFullYear()}`;
};

export const formatDateTimeForDisplay = (date) =>
  `${formatDateForDisplay(date)} @ ${formatTime(date)}`;

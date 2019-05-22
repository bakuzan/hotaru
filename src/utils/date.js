import Strings from '@/constants/strings';
import { padNumber } from './index';

const MS_DAY = 60 * 60 * 24 * 1000;

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

export function formatDateForInput(date) {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  return `${d.getFullYear()}-${padNumber(d.getMonth() + 1, 2)}-${padNumber(
    d.getDate(),
    2
  )}`;
}

export const formatDateTimeForDisplay = (date) =>
  `${formatDateForDisplay(date)} @ ${formatTime(date)}`;

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

export function getDaysInMonthForDate(date) {
  const d = new Date(date);
  return daysInMonth(d.getMonth() + 1, d.getFullYear());
}

const getWeekExtreme = (check) => (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + check(day);
  d.setDate(diff);
  return d;
};

const weekBeginning = getWeekExtreme((d) => (d === 0 ? -6 : 1));
const weekEnding = getWeekExtreme((d) => (d === 0 ? 0 : 7));

const daysDifferenceBetweenDates = (d1, d2) => {
  const a = new Date(d1).getTime();
  const b = new Date(d2).getTime();

  return Math.floor(b - a) / MS_DAY;
};

export const daysDifferenceFromMonday = (date) =>
  Math.abs(daysDifferenceBetweenDates(date, weekBeginning(date)));

export const daysDifferenceFromSunday = (date) =>
  Math.abs(daysDifferenceBetweenDates(weekEnding(date), date));

export const checkIfDatePartsMatch = (d1, d2) => {
  const dx = new Date(d1);
  const dy = new Date(d2);
  return {
    year: dx.getFullYear() === dy.getFullYear(),
    month: dx.getMonth() === dy.getMonth(),
    date: dx.getDate() === dy.getDate()
  };
};

export const getFirstDateOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  return d;
};

export const getLastDateOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

const setTimeForDate = (h, m, s) => (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s);
};

const startOfDay = setTimeForDate(0, 0, 0);

const getDatesAsMsAtMidnight = (...dates) => {
  return dates.map((d) => startOfDay(new Date(d)).getTime());
};

const datesAreEqual = (d1, d2) => {
  const [dx, dy] = getDatesAsMsAtMidnight(d1, d2);
  return dx === dy;
};

export const isBefore = (d1, d2) => {
  const [dx, dy] = getDatesAsMsAtMidnight(d1, d2);
  const before = dx < dy;
  return before;
};

export const isBeforeOrEqual = (d1, d2) =>
  isBefore(d1, d2) || datesAreEqual(d1, d2);

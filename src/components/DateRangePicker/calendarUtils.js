import Strings from '@/constants/strings';
import ViewOptionEnum from '@/constants/calendarViewOption';
import { generateUniqueId } from '@/utils';
import {
  daysDifferenceFromMonday,
  daysDifferenceFromSunday,
  checkIfDatePartsMatch,
  getDaysInMonthForDate,
  getFirstDateOfMonth,
  getLastDateOfMonth,
  isBefore,
  isBeforeOrEqual
} from '@/utils/date';

export function adjustDateDay(date, adjustment) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + adjustment);
}

export function adjustDateMonth(date, adjustment) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + adjustment, d.getDate());
}

export function adjustDateYear(date, adjustment) {
  const d = new Date(date);
  return new Date(d.getFullYear() + adjustment, d.getMonth(), d.getDate());
}

export const displayYearOnly = (d) => new Date(d).getFullYear();

export const displayMonthAndYear = (d) => {
  const i = new Date(d).getMonth();
  return `${Strings.monthNames[i]} ${displayYearOnly(d)}`;
};

export function checkIfSelectedForView(state, option) {
  const selectedDate = new Date(state.selectedDate);
  const matches = checkIfDatePartsMatch(state.viewDate, state.selectedDate);
  return (
    (option.optionType === ViewOptionEnum.DAY &&
      matches.year &&
      matches.month &&
      option.text === selectedDate.getDate()) ||
    (option.optionType === ViewOptionEnum.MONTH &&
      matches.year &&
      Strings.monthNames.findIndex((x) => x === option.text) ===
        selectedDate.getMonth())
  );
}

const checkDatesAgainstRange = ({ afterDate, beforeDate }, ...comparisons) => {
  const [afterCheck, beforeCheck] = comparisons;
  return (
    (afterDate && isBefore(afterCheck, afterDate)) ||
    (beforeDate && !isBeforeOrEqual(beforeCheck || afterCheck, beforeDate))
  );
};

function dateIsOutOfRange(state, option, { afterDate, beforeDate }) {
  const { isMonthView, viewDate } = state;
  const { text: value } = option;

  if ((!afterDate && !beforeDate) || !value) {
    return false;
  }

  if (isMonthView) {
    const date = new Date(viewDate);
    date.setDate(value);
    return checkDatesAgainstRange({ afterDate, beforeDate }, date);
  } else {
    const d = new Date(viewDate);
    d.setDate(1);
    d.setMonth(Strings.monthNames.findIndex((x) => x === value));
    const firstOfMonth = getFirstDateOfMonth(d);
    const lastOfMonth = getLastDateOfMonth(d);
    return checkDatesAgainstRange(
      { afterDate, beforeDate },
      lastOfMonth,
      firstOfMonth
    );
  }
}

function ordinal(number) {
  const d = number % 10;
  return ~~((number % 100) / 10) === 1
    ? 'th'
    : d === 1
    ? 'st'
    : d === 2
    ? 'nd'
    : d === 3
    ? 'rd'
    : 'th';
}

function addDateSuffix(isMonthView, viewDate, date) {
  const activeDate = new Date(viewDate);

  if (!isMonthView) {
    return `${date} ${displayYearOnly(activeDate)}`;
  }

  return `${date}${ordinal(date)} ${displayMonthAndYear(activeDate)}`;
}

// OPTION GENERATION

export const mapToViewOption = (optionType, state) => (text) => {
  const { viewDate, afterDate, beforeDate } = state;
  const isMonthView = optionType !== ViewOptionEnum.MONTH;
  const isDummyDay = optionType === ViewOptionEnum.DUMMY_DAY;
  const isOutOfRange = dateIsOutOfRange(
    { isMonthView, viewDate },
    { optionType, text },
    { afterDate, beforeDate }
  );
  const title = isOutOfRange ? 'Out of range' : '';

  return {
    key: generateUniqueId(),
    text,
    optionType,
    isDummyDay,
    isOutOfRange,
    disabled: isDummyDay || isOutOfRange,
    title,
    ariaLabel: isOutOfRange
      ? title
      : text
      ? addDateSuffix(isMonthView, viewDate, text)
      : null
  };
};

export const getMonthsForDate = (state) =>
  Strings.monthNames.map(mapToViewOption(ViewOptionEnum.MONTH, state));

export const getDaysForDate = (state) => {
  const { viewDate: date } = state;
  const d = new Date(date);
  const monthLength = getDaysInMonthForDate(d);
  const firstOfMonth = getFirstDateOfMonth(d);
  const lastOfMonth = getLastDateOfMonth(d);
  const startDummyDays = daysDifferenceFromMonday(firstOfMonth);
  const endDummyDays = daysDifferenceFromSunday(lastOfMonth);

  return [
    ...Array(startDummyDays)
      .fill('')
      .map(mapToViewOption(ViewOptionEnum.DUMMY_DAY, state)),
    ...Array(monthLength)
      .fill(null)
      .map((_, num) => num + 1)
      .map(mapToViewOption(ViewOptionEnum.DAY, state)),
    ...Array(endDummyDays)
      .fill('')
      .map(mapToViewOption(ViewOptionEnum.DUMMY_DAY, state))
  ];
};

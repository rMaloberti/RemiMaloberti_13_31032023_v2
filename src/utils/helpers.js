/**
 * Month formater (number to string).
 * @function formatMonth
 * @param {Number} monthIndex A number between 0 and 11 corresponding to a month.
 * 
 * @returns The corresponding month written in a string.
 */
export const formatMonth = (monthIndex) => {
  switch (monthIndex) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      return '';
  }
};

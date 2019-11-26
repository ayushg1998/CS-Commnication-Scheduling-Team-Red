import mom from 'moment';

export function format_ymdh(date) {
  const t = mom(date);

  return t.format('MMM DD') + ', ' + t.format('YYYY') + ', ' + t.format('hh:mma');
}

export function format_h(date) {
  const t = mom(date);

  return t.format('hh:mma');
}

export const moment = mom;
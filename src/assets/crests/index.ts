const BASE = `${import.meta.env.BASE_URL}crests/`;

export const getCrest = (crestKey: string): string => {
  if (!crestKey) return '';
  return `${BASE}${crestKey}.svg`;
};

export default getCrest;

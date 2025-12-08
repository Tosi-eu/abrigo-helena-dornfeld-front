
export const formatBRTDate = (dateString: string) => {
  if (!dateString) return "-";

  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return dateString;

  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
};

export const parseLocalDate = (dateString: string) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

export const parseISODateAsLocal = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d); 
};

export const isExpired = (iso: string, today = new Date()) => {
  const expiry = parseISODateAsLocal(iso);
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return expiry < localToday;
};

export const daysUntil = (iso: string, today = new Date()) => {
  const expiry = parseISODateAsLocal(iso);
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.ceil((expiry.getTime() - localToday.getTime()) / (1000 * 3600 * 24));
};


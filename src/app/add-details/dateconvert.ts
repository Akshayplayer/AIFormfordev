export function formatToYYYYMMDD(dateInput: any): string {
  if (!dateInput || (typeof dateInput === 'string' && dateInput.trim() === '')) return '';

  let dateObj: Date | null = null;

  try {
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      dateObj = dateInput;
    } else if (typeof dateInput === 'number') {
      // Excel serial number to JS date
      dateObj = new Date(Math.round((dateInput - 25569) * 86400 * 1000));
    } else if (typeof dateInput === 'string') {
      const parts = dateInput.trim().split(/[-\/]/).map(Number);

      if (parts.length === 3 && parts.every(p => !isNaN(p))) {
        let [p1, p2, p3] = parts;

        if (p1 > 31) {
          // yyyy-mm-dd or yyyy-dd-mm
          if (p2 > 12) [p1, p2, p3] = [p1, p3, p2]; // yyyy-dd-mm
        } else if (p3 > 31) {
          // dd-mm-yyyy or mm-dd-yyyy
          if (p1 > 12) [p1, p2, p3] = [p3, p2, p1]; // dd-mm-yyyy
          else [p1, p2, p3] = [p3, p1, p2];         // mm-dd-yyyy
        }

        dateObj = new Date(p1, p2 - 1, p3);
      }

      // fallback to native parsing
      if (!dateObj || isNaN(dateObj.getTime())) {
        const fallback = new Date(dateInput);
        if (!isNaN(fallback.getTime())) dateObj = fallback;
      }
    }
  } catch {
    dateObj = null;
  }

  if (!dateObj || isNaN(dateObj.getTime())) return '';

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

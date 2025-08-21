export function calculateFine(issueDate, validTill) {
  const now = new Date();
  const valid = new Date(validTill);
  if (now <= valid) return 0;
  const daysLate = Math.ceil((now - valid) / (1000 * 60 * 60 * 24));
  return daysLate * 15;
}

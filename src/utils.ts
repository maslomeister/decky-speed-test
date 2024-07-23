export function compareDateToNow(isoDateString: string): string {
  const inputDate = new Date(isoDateString);
  const currentDate = new Date();

  const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );
  const differenceInHours = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60)
  );
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (differenceInMinutes < 1) {
    return "NOW";
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes}M AGO`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours}H AGO`;
  } else {
    return `${differenceInDays}D AGO`;
  }
}

export function convertBpsToMbps(bps: number): number {
  return Math.round(bps / 1000000); // 1 Mbps = 1,000,000 bps
}

export function getColor(value: number): string {
  if (value < 2) {
    return "#FF6557";
  }

  if (value === 2) {
    return "#ffffff";
  }

  if (value > 2) {
    return "#57C042";
  }

  return "#ffffff";
}

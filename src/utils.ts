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

export function convertBpsToMBs(bps: number): number {
  return parseFloat((bps / 8000000).toFixed(1)); // 1 MB/s = 8,000,000 bps
}

export function convertMbpsToMBs(mbps: number): number {
  return parseFloat((mbps / 8).toFixed(1)); // 1 MB/s = 8 Mbps
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

// credits to https://github.com/ma3a/SDH-PlayTime

export const log = (...args: any[]) => {
  console.log(
    `%c SpeedTest %c`,
    "background: #16a085; color: black;",
    "background: #1abc9c; color: black;",
    ...args
  );
};

export const debug = (...args: any[]) => {
  console.debug(
    `%c SpeedTest %c`,
    "background: #16a085; color: black;",
    "background: #1abc9c; color: black;",
    ...args
  );
};

export const error = (...args: any[]) => {
  console.error(
    `%c SpeedTest %c`,
    "background: #16a085; color: black;",
    "background: #FF0000;",
    ...args
  );
};

let logger = {
  info: (...args: any[]) => {
    log(...args);
  },

  debug: (...args: any[]) => {
    debug(...args);
  },

  error: (...args: any[]) => {
    error(...args);
  },
};

export default logger;

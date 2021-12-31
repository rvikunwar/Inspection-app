var monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

export const dateformat = (timestamp) => {
    
    let date= new Date(timestamp)

    let time = `${date.getDate()} ${monthShortNames[date.getMonth()]}, ${date.getFullYear()}`;

    return time
} 


export const backendDateFormat = (timestamp) => {
  let date= new Date(timestamp)

  let time = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  return time
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export const renderTimestamp = (timestamp) => {
    let prefix = '';
    let time = new Date(timestamp);
    time = `${time.getFullYear()} ${time.toLocaleString('default', {
        month: 'short',
    })}, ${time.getDate()} `;

    const timeDiff = Math.round(
      (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
        // less than one minute ago
        prefix = 'just now...';
      } else if (timeDiff < 60 && timeDiff >= 1) {
          // less than sixty minutes ago
          prefix = `${timeDiff} minutes ago`;
    } else if (timeDiff < 24 * 60 && timeDiff >= 60) {
        // less than 24 hours ago
        prefix = `${Math.round(timeDiff / 60)} hours ago`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff >= 24 * 60) {
        // less than 7 days ago
        prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
    } else {
        prefix = time;
    }

    return prefix;
};
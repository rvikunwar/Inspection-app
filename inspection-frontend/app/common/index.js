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
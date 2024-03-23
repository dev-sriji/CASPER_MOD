//extractTime

export function extractTime(timeStamp) {
  const date = new Date(timeStamp);
  const hour = padZero(date.getHours());
  const minute = padZero(date.getMinutes());
  return `${hour} : ${minute}`;
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}

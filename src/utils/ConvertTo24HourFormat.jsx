
function ConvertTo24HourFormat(time12Hour) {
    const [time, period] = time12Hour.split(' ');
  
    let [hours, minutes, seconds] = time.split(':');
    hours = parseInt(hours, 10);
  
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    return formattedTime;
  }
  

export default ConvertTo24HourFormat
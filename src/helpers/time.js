export const greeting = (timeStamp) => {
    const hours = new Date(timeStamp).getHours();
    let greeting;
    if (hours >= 5 && hours < 12) greeting = "Good morning";
    if (hours >= 12 && hours < 18) greeting = "Good afternoon";
    if (hours >= 18 && hours < 23) greeting = "Good evening";
    if ( hours >= 23 || hours < 5) greeting = "Good night";
    return greeting;
};
export const msToDate = (timeStamp) => {
    const time = new Date(timeStamp)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = {
        year: time.getFullYear(),
        month: monthNames[time.getMonth()],
        dayName : days[time.getDay()],
        day: time.getDate(),
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds : time.getSeconds()
    }
    return `${d.dayName} ${d.day} ${d.month} ${d.hours}:${d.minutes}:${d.seconds}`
};
export const timeStringToSeconds = (string) => {
    const splitTime = string.split(":");
    const hour = parseInt(splitTime[0], 10) * 3600;
    const min = parseInt(splitTime[1], 10) * 60;
    return hour + min
};

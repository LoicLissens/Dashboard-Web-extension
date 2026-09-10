export const greeting = (timeStamp:number): string => {
    const hours = new Date(timeStamp).getHours();
    if (hours >= 5 && hours < 12) return "Good morning";
    if (hours >= 12 && hours < 18) return "Good afternoon";
    if (hours >= 18 && hours < 23) return "Good evening";
    return "Good night";
};
export const msToDate = (timeStamp : number):string => {
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
export const timeStringToSeconds = (value:string): number => {
    const splitTime = value.split(":");
    const hour = parseInt(splitTime[0], 10) * 3600;
    const min = parseInt(splitTime[1], 10) * 60;
    return hour + min
};

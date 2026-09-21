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
/** "today" / "yesterday" / "6 days ago" -- how stale an imported snapshot is. */
export const daysAgo = (timeStamp: number, now: number = Date.now()): string => {
    const startOfDay = (t: number) => {
        const d = new Date(t);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    };
    const days = Math.round((startOfDay(now) - startOfDay(timeStamp)) / 86_400_000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
};
/** Local parts only: an all-day event is local midnight, so UTC shifts the day. */
export const dayKey = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
export const timeStringToSeconds = (value:string): number => {
    const splitTime = value.split(":");
    const hour = parseInt(splitTime[0], 10) * 3600;
    const min = parseInt(splitTime[1], 10) * 60;
    return hour + min
};

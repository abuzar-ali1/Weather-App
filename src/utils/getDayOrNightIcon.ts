export function getDayOrNightIcon(
    iconname: string,
    dateTime: string

): string {
    const hours = new Date(dateTime).getHours();
    
    const isDayTime = hours >= 6 && hours <= 18;
    return isDayTime ? iconname.replace(/.$/, "d") : iconname.replace(/.$/, "n");           
   
}
export default function convertKalvinToCal(tempInkalvin: number) {
  const tempInCal = tempInkalvin - 273.15;
    return Math.floor(tempInCal);
}
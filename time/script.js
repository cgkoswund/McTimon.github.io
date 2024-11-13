console.log("js is linked");
const date = new Date();

//current Time
const daysPassed = date.getDay();
const hoursPassed = date.getHours();
const minutesPassed = date.getMinutes();
const secondsPassed = date.getSeconds();

/*
 * TODO set exact times for activities so it can skip remainders accurately
 */

//absolutes
const totalDays = 7;
const totalHours = 24;
const totalMinutes = 60;
const totalSeconds = 60;
const sleepTime = 8; //hours
const eatTime = 3; //hours
const bathNDressTime = 1; //hours per day

//optionals
const useOptionals = true;
const holeHoursPerDay = sleepTime + eatTime + bathNDressTime;
const holeHours = useOptionals ? holeHoursPerDay * 7 : 0;

//remainders
const remainingDays = totalDays - daysPassed;
const remainingHours = totalHours - hoursPassed;
const remainingMinutes = totalMinutes - minutesPassed;
const remainingSeconds = totalSeconds - secondsPassed;
const remainingAbsoluteHours =
  remainingDays * 24 -
  holeHoursPerDay * remainingDays +
  remainingHours +
  remainingMinutes / 60;
const remainingAbsHrsTrimmed = Math.floor(remainingAbsoluteHours * 1000) / 1000;

//publish tests
// const finalInfo = `${remainingDays}:${remainingHours}:${remainingDays} of free time left this week`;
const finalInfo = `${remainingAbsHrsTrimmed} hrs of free time left this week`;

const textElement = document.querySelector("#timeTextElement");
textElement.innerHTML = finalInfo;
/*
 * 1  2   3   4   5   6   7
 * M  T   W   T   F   S   S
 */
//hopefully I can religiously get back to this

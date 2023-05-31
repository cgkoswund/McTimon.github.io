console.log("js is linked");
const date = new Date();
console.log("the day is: ", date.getDay()); //day of the week
console.log("the hours are: ", date.getHours()); //hours elapsed today
console.log("the mins are: ", date.getMinutes()); //hours left today
console.log("the mins are: ", date.getSeconds()); //hours left today

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
  remainingDays * 24 - holeHoursPerDay + remainingHours + remainingMinutes / 60;
const remainingAbsHrsTrimmed = Math.floor(remainingAbsoluteHours * 1000) / 1000;

//publish
// const finalInfo = `${remainingDays}:${remainingHours}:${remainingDays} of free time left this week`;
const finalInfo = `${remainingAbsHrsTrimmed} hrs of free time left this week`;
console.log("final final:", finalInfo);
console.log("final converted:", remainingAbsHrsTrimmed);

const textElement = document.querySelector("#timeTextElement");
textElement.innerHTML = finalInfo;
/*
 * 1  2   3   4   5   6   7
 * M  T   W   T   F   S   S
 */

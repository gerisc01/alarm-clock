/******************************************************************************
        CONSTRUCTOR
******************************************************************************/

// parent: [String] The id of the parent div that the clock will be placed in
// seconds: [Boolean] If true, the clock will display in the form of HH:MM SS.
//               If false, the clock will display as HH:MM. Defaults to false. 
var Clock = function (parent, seconds) {
    // Configuration variables
    this.moduleName = "clock";
    this.parentElement = "module1";
    this.militaryTime = false;

    // Modifiable Variables
    this.alarms = [];
    this.hours = 0;
    this.minutes = 0;
    if (seconds === true) { this.seconds = 0; }
    this.clockInterval = undefined;
    this.secondsInterval = undefined;

    // Constructor Actions
    this.start();
    this.draw();
    console.log(this.hours);
    console.log(this.minutes);
    console.log(this.seconds);
};

/******************************************************************************
        INSTANCE METHODS
******************************************************************************/

Clock.prototype.draw = function() {
    var clockContainer = $("<div/>").addClass("clock-module");

    // Draw the hours
    var hoursObj = $("<span/>").attr("id","hours");
    var displayHr,am_pm;
    if (this.militaryTime === true) {
        displayHr = this.hours;
    } else {
        displayHr = this.hours > 12 ? this.hours - 12 : this.hours;
        am_pm = displayHr < 12 ? "AM" : "PM";
        if (displayHr === 0) displayHr = 12;
    }
    hoursObj.append($("<ul/>").text(displayHr.toString().substr(0,1)));
    if (displayHr > 9) { hoursObj.append($("<ul/>").text(displayHr.toString().substr(1))); }
    hoursObj.append("<ul>:</ul>");

    // Draw the minutes
    var minutesObj = $("<span/>").attr("id","minutes");
    var minuteStr = this.minutes < 10 ? "0" + this.minutes.toString() : this.minutes.toString();
    minutesObj.append($("<ul/>").text(minuteStr.substr(0,1)));
    minutesObj.append($("<ul/>").text(minuteStr.substr(1)));
    if (this.seconds !== undefined) minutesObj.append("<ul> </ul>");

    // Append hours and minutes to the clock container
    clockContainer.append(hoursObj,minutesObj);

    // Draw the seconds if the clock is configured for that
    if (this.seconds !== undefined) {
        var secondsObj = $("<span/>").attr("id","seconds");
        var secondsStr = this.seconds < 10 ? "0" + this.seconds.toString() : this.seconds.toString();
        secondsObj.append($("<ul/>").text(secondsStr.substr(0,1)));
        secondsObj.append($("<ul/>").text(secondsStr.substr(1)));
        // Append seconds to the clock container
        clockContainer.append(secondsObj);
    }

    // Append AM/PM value to clock container if not military time
    if (am_pm !== undefined) clockContainer.append($("<span/>").text(am_pm));

    $("div#"+this.parentElement+" div.clock-module").remove();
    $("div#"+this.parentElement).append(clockContainer);
};

Clock.prototype.start = function() {
    clearInterval(this.clockInterval);
    this.syncTime();
    var secBeforeNextMin = (60 - (new Date()).getSeconds()) * 1000 + 5;
    setTimeout(this.startIntervalHelper.bind(this),secBeforeNextMin);
    if (this.seconds !== undefined) {
        clearInterval(this.secondsInterval);
        this.secondsInterval = setInterval(this.nextSecond.bind(this),1000);
    }
};

Clock.prototype.destroy = function() {};

Clock.prototype.getAlarms = function() {
    return this.alarms;
};

// time: [String] Time in 24 hours
// repeat: [Boolean] Does the alarm repeat
// days: [String] If the alarm does repeat, for what days. If not, what
//                  day is the alarm planned to go off
// alarmFile: [String] The file that will be played for the alarm
Clock.prototype.setAlarm = function(time,repeat,days,alarmFile) {
    var newAlarm = {};
    newAlarm["time"] = normalizeMilitaryTime(time);
    if (repeat === undefined) {
        newAlarm["repeat"] = false;
    } else {
        newAlarm["repeat"] = repeat;
    }
    newAlarm["days"] = days;
    newAlarm["alarmFile"] = alarmFile;

    this.alarms.push(this.validateAlarm(newAlarm));
};

/******************************************************************************
        HELPER METHODS
******************************************************************************/

Clock.prototype.startIntervalHelper = function() {
    this.nextMinute();
    this.clockInterval = setInterval(this.nextMinute.bind(this),60000);
};

Clock.prototype.nextMinute = function() {
    // Every half an hour, restart the clock based on the javascript time
    if (this.minutes === 17 || this.minutes === 47) {
        this.start(); return;
    }
    this.minutes = (this.minutes + 1) % 60;
    if (this.minutes === 0) { this.hours = (this.hours + 1) % 24; }
    if (this.seconds !== undefined) {
        clearInterval(this.secondsInterval);
        this.seconds = 0;
        this.secondsInterval = setInterval(this.nextSecond.bind(this),1000);
    }
    this.draw();
};

Clock.prototype.nextSecond = function() {
    this.seconds = (this.seconds + 1) % 60;
    this.draw();
};

Clock.prototype.syncTime = function() {
    var time = new Date();
    this.hours = time.getHours();
    this.minutes = time.getMinutes();
    if (this.seconds !== undefined) { this.seconds = time.getSeconds(); }
};

Clock.prototype.validateAlarm = function(alarm) {
    if (alarm["time"] === null) {
        throw new Error("Invalid Alarm Time");
    } else if (alarm["repeat"] !== true && alarm["repeat"] !== false) {
        throw new Error("Invalid Repeat Value. Must be a boolean");
    }
};

Clock.prototype.validateDate = function(date) {};
Clock.prototype.validateRepeatDays = function(days) {};

// Checks if the military time string that was passed in is a valid
// time and strips the leading zero off of the string if it is present

// time: [String] Time in 24 hours
function normalizeMilitaryTime(time)
{
    var normalizedTime = null;
    var match = /^([01])?[0-9]:[0-5][0-9]$/.exec(time);
    if (match !== null) {
        normalizedTime = match[1] == "0" ? time.substr(1) : time;
    } else {
        match = /^[2][0-3]:[0-5][0-9]$/.exec(time);
        if (match !== null) { normalizedTime = time; }
    }

    return normalizedTime;
};
/******************************************************************************
        CONSTRUCTOR
******************************************************************************/

// seconds: [Boolean] If true, the clock will display in the form of HH:MM SS.
//               If false, the clock will display as HH:MM. Defaults to false. 
var Clock = function (parent, seconds) {
    this.alarms = [];
    this.hours = 0;
    this.minutes = 0;
    if (seconds === true) { this.seconds = 0; }
    this.militaryTime = false;

    this.moduleName = "clock";
    this.parentElement = "module_1";
    this.syncTime();
};

/******************************************************************************
        INSTANCE METHODS
******************************************************************************/

Clock.prototype.draw = function() {
    var clockContainer = $("<div/>").addClass("alarm-clock");
    var hours = $("<span/>").attr("id","hours");
    hours.append("<ul/>","<ul/>");
    var minutes = $("<span/>").attr("id","minutes");
    minutes.append("<ul/>","<ul/>");
    if (this.seconds !== undefined) {
        var seconds = $("<span/>").attr("id","seconds");
        seconds.append("<ul/>","<ul/>");
    }
    $("div#"+this.parentElement).append("");
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

Clock.prototype.nextSecond = function() {};
Clock.prototype.nextMinute = function() {};

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
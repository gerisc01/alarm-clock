/******************************************************************************
        CONSTRUCTOR
******************************************************************************/

var Clock = function () {
    this.alarms = [];
    console.log('Clock object instantiated');
};

/******************************************************************************
        INSTANCE METHODS
******************************************************************************/

Clock.prototype.getAlarms = function() {
    return this.alarms;
};

// time: [String] Time in 24 hours
// repeat: [Boolean] Does the alarm repeat
// days: [String] If the alarm does repeat, for what days. If not, what
//                  day is the alarm planned to go off
// alarmFile: [String] The file that will be played for the alarm
Clock.prototype.setAlarm = function(time,repeat,days,alarmFile) {
    if (time)

    this.alarms.push("10:15");
}

/******************************************************************************
        HELPER METHODS
******************************************************************************/

// Checks if the military time string that was passed in is a valid
// time and strips the leading zero off of the string if it is present

// time: [String] Time in 24 hours
function normalizeMilitaryTime(time)
{
    var normalizedTime = null;
    var match = /^([01])?[0-9]:[0-5][0-9]$/.exec(time);
    if (match != null) {
        normalizedTime = match[1] == "0" ? time.substr(1) : time;
    } else {
        match = /^[2][0-3]:[0-5][0-9]$/.exec(time);
        if (match != null) { normalizedTime = time; }
    }

    return normalizedTime;
}
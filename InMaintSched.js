var toast = new GlideDateTime('2015-02-01 00:08:00');
var test = testDateTime(toast)

function testDateTime(datetime) {

//get day of week

var dow = datetime.getDayOfWeekUTC();

//get time and figure out hour
var todGet = '' + datetime.getTime();
todGet = todGet.split(' ');
var todGo = todGet[1].split(':');
var hour = todGo[0];
var min = todGo[1];
var sec = todGo[2];
if (dow == 3 || dow == 7) {
	//ok, so we're within the window, but...  what time is it?
	gs.log('YUP - This is a Wednesday or Sunday!');

	//check time to see if we're in 12am-6am
	if (hour < 6 || (hour == 6 && min == 0 && sec == 0)) {
		gs.log(hour + ' - WE\'RE GOOD!');
		return true;
	}
	else {
		gs.log(hour + ':' + min + ':' + sec + ' is not between 00:00:00 and 06:00:00');
		return false;
	}
}
else {
	//failed day check...  do not save
	gs.log(dow);
	gs.log('NOPE...  Sunday or a Wednesday');
	return false;
	}
}
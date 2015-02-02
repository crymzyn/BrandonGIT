//EXAMPLE CALL

	var ga = new GlideAjax('m_inWSOMaintWindow');
	ga.addParam('sysparm_name', 'verifyDateTime');
	ga.addParam('sysparm_deployParm', deployParm);
	ga.getXMLWait(); // Always try to use asynchronous (getXML) calls rather than synchronous (getXMLWait)
	
	var testTime = ga.getAnswer();

//SCRIPT INCLUDE

var m_inWSOMaintWindow = Class.create();
m_inWSOMaintWindow.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	
	verifyDateTime: function() {
		//verify the date/time passed in is within Maritz WSO windows
		var deployParm = this.getParameter('sysparm_deployParm');
		var deploy = new GlideDateTime(deployParm);
			
		//get day of week
		var dow = deploy.getDayOfWeekUTC();
		
		//get time and figure out hour
		var todGet = '' + deploy.getTime();
		todGet = todGet.split(' ');
		var todGo = todGet[1].split(':');
		var hour = todGo[0];
		var min = todGo[1];
		var sec = todGo[2];
		
		if (dow == 3 || dow == 7) {
			
			//its a wednesday or sunday
			//check time to see if we're in 12am-6am
			if (hour < 6 || (hour == 6 && min == 0 && sec == 0)) {
				gs.log('PASS: ' + deployParm + ' is within a maintenance window.');
				return true;
			}
			else {
				//failed day check...  do not save
				gs.log('FAIL: ' + deployParm + ' is not between the hours of 00:00:00 and 06:00:00');
				return false;
			}
		}
		else {
			//failed day check...  do not save
			gs.log('FAIL: ' + deployParm + ' is not on a Wednesday or Sunday.');
			return false;
		}
		
	},
	
	type: 'm_inWSOMaintWindow'
});
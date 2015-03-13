function addRowToTable() {
	var div = document.getElementById('divResources');
	var hide = div.style.display == "none";
	if (hide) {
		div.style.display="block";
	}
	
	var tbl = document.getElementById('resources');
	var lastRow = tbl.rows.length;
	
	var iteration = '';
	if (lastRow >= 3) {
		iteration = (lastRow/3) + 1;
	}
	else {
		iteration = 1;
	}
	
	var rowhr = '';
	var row = '';
	var row2 = '';
	
	if (lastRow > 2) {
		rowhr = tbl.insertRow(lastRow);
		rowhr.style.height = '10px';
		row = tbl.insertRow(lastRow + 1);
		row2 = tbl.insertRow(lastRow + 2);
		row2.style.height = '50px';
		var cellhr1 = rowhr.insertCell(0);
		cellhr1.setAttribute('colspan',4);
		var hrline = document.createElement('hr');
		cellhr1.appendChild(hrline);
		var brline = document.createElement('br');
		cellhr1.appendChild(brline);
	}
	else {
		row = tbl.insertRow(lastRow);
		row2 = tbl.insertRow(lastRow + 1);
		row2.style.height = '50px';
	}
	
	var cell1 = row.insertCell(0);
	var hostSource = document.createElement('textarea');
	hostSource.type = 'text';
	hostSource.name = 'sourceAddress' + iteration;
	hostSource.id = 'sourceAddress' + iteration;
	hostSource.cols = 40;
	cell1.appendChild(hostSource);
	
	var cell2 = row.insertCell(1);
	var hostDestination = document.createElement('textarea');
	hostDestination.type = 'text';
	hostDestination.name = 'destinationAddress' + iteration;
	hostDestination.id = 'destinationAddress' + iteration;
	hostDestination.cols = 40;
	cell2.appendChild(hostDestination);
	
	var cell3 = row.insertCell(2);
	var selector = document.createElement('select');
	selector.id =  'portType' + iteration;
	selector.name = 'portType' + iteration;
	selector.multiple = 'multiple';
	selector.size = '4';
	
	var options = ['FTP - TCP Port 21',
	'FTPS - TCP Port 990 & 20000-20500',
	'HTTP - TCP Port 80',
	'HTTPS - TCP Port 443',
	'ICA - TCP Port 1494',
	'Oracle_1521 - TCP Port 1521',
	'Oracle_1522 - TCP Port 1522',
	'Oracle_1523 - TCP Port 1523',
	'Oracle_1524 - TCP Port 1524',
	'Oracle_1525 - TCP Port 1525',
	'Oracle_1526 - TCP Port 1526',
	'Oracle_1527 - TCP Port 1527',
	'Oracle_1528 - TCP Port 1528',
	'RDP - TCP Port 3389',
	'SFTP - TCP Port 22',
	'SMTP - TCP Port 25',
	'SQL - TCP Port 1433_1344',
	'SSH - TCP Port 22'
	];
	
	for (var i = 0; i < options.length; i++) {
		var option = document.createElement('option');
		option.value = options[i];
		option.text = options[i];
		selector.appendChild(option);
	}
	
	cell3.appendChild(selector);
	
	// port Other
	var cell4 = row.insertCell(3);
	var portOther = document.createElement('input');
	portOther.type = 'checkbox';
	portOther.name = 'portOther' + iteration;
	portOther.id = 'portOther' + iteration;
	portOther.style.verticalAlign = 'middle';
	portOther.style.padding = '5px';
	var setOnClick = 'portOtherReason(' + iteration + ')';
	portOther.setAttribute('onclick',setOnClick);
	cell4.appendChild(portOther);
	
	// port Other reason text
	var portBR = document.createElement('textarea');
	hostDestination.size = 30;
	portBR.type = 'text';
	portBR.name = 'portBR' + iteration;
	portBR.id = 'portBR' + iteration;
	portBR.style.display = 'none';
	portBR.style.verticalAlign = 'middle';
	cell4.appendChild(portBR);
	
	var cell2_1 = row2.insertCell(0);
	var isTemp = document.createElement('input');
	isTemp.type = 'checkbox';
	isTemp.name = 'isTemp' + iteration;
	isTemp.id = 'isTemp' + iteration;
	isTemp.style.verticalAlign = 'middle';
	var isTempShowDate = 'isTempShowDate(' + iteration + ')';
	isTemp.setAttribute('onclick',isTempShowDate);
	
	var labelTemp = document.createElement('isTempLbl');
	labelTemp.htmlFor = 'isTemp';
	labelTemp.id = 'labelTemp' + iteration;
	labelTemp.style.fontWeight = 'bold';
	labelTemp.style.verticalAlign = 'middle';
	labelTemp.appendChild(document.createTextNode('Is this a temporary rule?'));
	
	cell2_1.appendChild(isTemp);
	cell2_1.appendChild(labelTemp);
	
	var cell2_2 = row2.insertCell(1);
	var isTempDuration = document.createElement('select');
	isTempDuration.name = 'isTempDuration' + iteration;
	isTempDuration.id = 'isTempDuration' + iteration;
	isTempDuration.style.verticalAlign = 'middle';
	isTempDuration.style.display = 'none';
	
	var op1 = new Option();
	op1.value = 30;
	op1.text = '30 days';
	isTempDuration.options.add(op1);
	var op2 = new Option();
	op2.value = 90;
	op2.text = '90 days';
	isTempDuration.options.add(op2);
	var op3 = new Option();
	op3.value = 180;
	op3.text = '180 days';
	isTempDuration.options.add(op3);
	var op4 = new Option();
	op4.value = 'other';
	op4.text = 'Other';
	isTempDuration.options.add(op4);
	
	var isTempDurationOther = 'isTempDurationOther(' + iteration + ')';
	isTempDuration.setAttribute('onchange',isTempDurationOther);
	
	var labelTempDuration = document.createElement('isTempDurationLbl');
	labelTempDuration.htmlFor = 'isTempDuration';
	labelTempDuration.id = 'labelTempDuration' + iteration;
	labelTempDuration.style.display = 'none';
	labelTempDuration.style.fontWeight = 'bold';
	labelTempDuration.style.verticalAlign = 'middle';
	labelTempDuration.appendChild(document.createTextNode('Effective for: '));
	
	var isTempDurationOtherDays = document.createElement('input');
	isTempDurationOtherDays.type = 'text';
	isTempDurationOtherDays.name = 'isTempDurationOtherDays' + iteration;
	isTempDurationOtherDays.id = 'isTempDurationOtherDays' + iteration;
	isTempDurationOtherDays.size = 3;
	isTempDurationOtherDays.style.verticalAlign = 'middle';
	isTempDurationOtherDays.style.display = 'none';
	
	var labelTempDurationOtherDays = document.createElement('isTempLbl');
	labelTempDurationOtherDays.htmlFor = 'isTempDurationOtherDays';
	labelTempDurationOtherDays.id = 'labelTempDurationOtherDays' + iteration;
	labelTempDurationOtherDays.style.fontWeight = 'bold';
	labelTempDurationOtherDays.style.verticalAlign = 'middle';
	labelTempDurationOtherDays.style.display = 'none';
	labelTempDurationOtherDays.appendChild(document.createTextNode('days'));
	
	cell2_2.appendChild(labelTempDuration);
	cell2_2.appendChild(isTempDuration);
	cell2_2.appendChild(isTempDurationOtherDays);
	cell2_2.appendChild(labelTempDurationOtherDays);
	
}

function removeRowFromTable() {
	for (var i = 0; i < 3; i++) {
		var tbl = document.getElementById('resources');
		var lastRow = tbl.rows.length;
		if (lastRow > 3) {
			tbl.deleteRow(lastRow - 1);
		}
	}
}

function portOtherReason(num) {
	var div = document.getElementById('divResources');
	var hide = div.style.display == "none";
	if (!hide) {
		
		this.num = num;
		if (document.getElementById('portOther' + num).checked == true) {
			if (document.getElementById('portBR' + num).style.display == 'none') {
				document.getElementById('portBR' + num).style.display = '';
				if (document.getElementById('portBR' + num).value == '') {
					document.getElementById('portBR' + num).value = 'Please enter the port(s) needed along with business justification.';
				}
			}
		}
		else {
			if (document.getElementById('portBR' + num).style.display == '') {
				document.getElementById('portBR' + num).style.display = 'none';
				if (document.getElementById('portBR' + num).value == 'Please enter the port(s) needed along with business justification.') {
					document.getElementById('portBR' + num).value = '';
				}
			}
		}
	}
}

function isTempShowDate(num) {
	var div = document.getElementById('divResources');
	var hide = div.style.display == "none";
	if (!hide) {
		
		this.num = num;
		if (document.getElementById('isTemp' + num).checked == true) {
			if (document.getElementById('isTempDuration' + num).style.display == 'none') {
				document.getElementById('isTempDuration' + num).style.display = '';
			}
			if (document.getElementById('labelTempDuration' + num).style.display == 'none') {
				document.getElementById('labelTempDuration' + num).style.display = '';
			}
			if (document.getElementById('isTempDuration' + num).value == 'other') {
				if (document.getElementById('isTempDurationOtherDays' + num).style.display == 'none') {
					document.getElementById('isTempDurationOtherDays' + num).style.display = '';
				}
				if (document.getElementById('labelTempDurationOtherDays' + num).style.display == 'none') {
					document.getElementById('labelTempDurationOtherDays' + num).style.display = '';
				}
			}
		}
		else {
			if (document.getElementById('isTempDuration' + num).style.display == '') {
				document.getElementById('isTempDuration' + num).style.display = 'none';
			}
			if (document.getElementById('labelTempDuration' + num).style.display == '') {
				document.getElementById('labelTempDuration' + num).style.display = 'none';
			}
			if (document.getElementById('isTempDurationOtherDays' + num).style.display == '') {
				document.getElementById('isTempDurationOtherDays' + num).style.display = 'none';
			}
			if (document.getElementById('labelTempDurationOtherDays' + num).style.display == '') {
				document.getElementById('labelTempDurationOtherDays' + num).style.display = 'none';
			}
		}
	}
}

function isTempDurationOther(num) {
	var div = document.getElementById('divResources');
	var hide = div.style.display == "none";
	if (!hide) {
		
		this.num = num;
		if (document.getElementById('isTempDuration' + num).value == 'other') {
			if (document.getElementById('isTempDurationOtherDays' + num).style.display == 'none') {
				document.getElementById('isTempDurationOtherDays' + num).style.display = '';
			}
			if (document.getElementById('labelTempDurationOtherDays' + num).style.display == 'none') {
				document.getElementById('labelTempDurationOtherDays' + num).style.display = '';
			}
		}
		else {
			if (document.getElementById('isTempDurationOtherDays' + num).style.display == '') {
				document.getElementById('isTempDurationOtherDays' + num).style.display = 'none';
			}
			if (document.getElementById('labelTempDurationOtherDays' + num).style.display == '') {
				document.getElementById('labelTempDurationOtherDays' + num).style.display = 'none';
			}
		}
	}
}
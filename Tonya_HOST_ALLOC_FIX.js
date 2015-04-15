
::::Script to fix Host Allocation Department::::

var ritm = new GlideRecord('sc_req_item');
ritm.addEncodedQuery('active=true^cat_item=b7569dca879e4900ba872c526a434d93');
ritm.query();

while (ritm.next()) {
gs.log('Number = ' + ritm.number);
gs.log('Variable value = ' + ritm.variables.ci_svr_newvrt_ami_host_dept_select);
var value = ritm.variables.ci_svr_newvrt_ami_host_dept_select;
if (value == '26168cfc0079e400ba87f47595a1d1dd') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '38516'; //
ritm.update()
}
if (value == 'eb164cfc0079e400ba87f47595a1d15b') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '20386'; //
ritm.update()
}
if (value == '61168cfc0079e400ba87f47595a1d169') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '30870'; //
ritm.update()
}
if (value == 'ba16ccfc0079e400ba87f47595a1d10c') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '40046'; //
ritm.update()
}
if (value == 'ea168cfc0079e400ba87f47595a1d1dc') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '38514'; //
ritm.update()
}
if (value == 'b9168cfc0079e400ba87f47595a1d172') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '30887'; //
ritm.update()
}
if (value == 'e9168cfc0079e400ba87f47595a1d165') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '30863'; //
ritm.update()
}
if (value == '71168cfc0079e400ba87f47595a1d172') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '37844'; //
ritm.update()
}
if (value == '71168cfc0079e400ba87f47595a1d172') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '37844'; //
ritm.update()
}
if (value == '56160cfc0079e400ba87f47595a1d1b7') {
ritm.variables.ci_svr_newvrt_ami_host_dept_select = '10400'; //
ritm.update()
}
}

::::Variable Options List::::

View	Bond Brand Loyalty - Tom Bliangas - 38516	38516	100	
View	CSI - Steve Dersch - 20386	20386	200	
View	Information Security - Brad Najar - 30870	30870	300	
View	MCX - Chris Clement - 40046	40046	400	
View	MCX UK - Christoph Stolz - 38514	38514	500	
View	MITS (Corporate) - Ron Hunsaker - 30887	30887	600	
View	MITS (Infrastructure) - John Mount - 30863	30863	700	
View	MMS - Andrea Roever - 37844	37844	800	
View	MT - Dipak Biscuitwala - 10400	10400	900
Fin Hosp IT (37813)

::::Recorded from script::::

*** Script: Number = RITM0094367
*** Script: Variable value = 30887
*** Script: Number = RITM0099416
*** Script: Variable value = 56160cfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0111081
*** Script: Variable value = dc16ccfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0114574
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0076882
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0114578
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0113680
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0106879
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0114077
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0089621
*** Script: Variable value = ba16ccfc0079e400ba87f47595a1d10c
*** Script: Number = RITM0076888
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0076879
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0112281
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0100606
*** Script: Variable value = 064869f059299940bdc4b3980d4b52fe
*** Script: Number = RITM0095005
*** Script: Variable value = da168cfc0079e400ba87f47595a1d1c1
*** Script: Number = RITM0102493
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0112336
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0100370
*** Script: Variable value = e016ccfc0079e400ba87f47595a1d1e1
*** Script: Number = RITM0112681
*** Script: Variable value = ba16ccfc0079e400ba87f47595a1d10c
*** Script: Number = RITM0092728
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0076870
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0114961
*** Script: Variable value = 16168cfc0079e400ba87f47595a1d1c2
*** Script: Number = RITM0114389
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0094334
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0104790
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0100371
*** Script: Variable value = e016ccfc0079e400ba87f47595a1d1e1
*** Script: Number = RITM0092914
*** Script: Variable value = 31168cfc0079e400ba87f47595a1d176
*** Script: Number = RITM0104193
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0092246
*** Script: Variable value = ed168cfc0079e400ba87f47595a1d167
*** Script: Number = RITM0101743
*** Script: Variable value = ed168cfc0079e400ba87f47595a1d167
*** Script: Number = RITM0076864
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0099421
*** Script: Variable value = 56160cfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0079691
*** Script: Variable value = ba16ccfc0079e400ba87f47595a1d10c
*** Script: Number = RITM0115481
*** Script: Variable value = 16168cfc0079e400ba87f47595a1d1c2
*** Script: Number = RITM0099450
*** Script: Variable value = 56160cfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0116044
*** Script: Variable value = 71168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0093897
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0114576
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0076884
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0105829
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0105828
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0092835
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0116458
*** Script: Variable value = 38516
*** Script: Number = RITM0075917
*** Script: Variable value = eb164cfc0079e400ba87f47595a1d15b
*** Script: Number = RITM0096076
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0105825
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0108684
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0076874
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0111864
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0114364
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0104353
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0106280
*** Script: Variable value = ba16ccfc0079e400ba87f47595a1d10c
*** Script: Number = RITM0114363
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0102440
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0112117
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0110014
*** Script: Variable value = fd284ff400f9e400ba87f47595a1d14d
*** Script: Number = RITM0076876
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0116459
*** Script: Variable value = 38516
*** Script: Number = RITM0115503
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0106355
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0109574
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0113244
*** Script: Variable value = 31168cfc0079e400ba87f47595a1d176
*** Script: Number = RITM0114382
*** Script: Variable value = 1b4018c96c6809404932ab9b1846169a
*** Script: Number = RITM0112115
*** Script: Variable value = 26168cfc0079e400ba87f47595a1d1dd
*** Script: Number = RITM0076880
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0110634
*** Script: Variable value = c1168cfc0079e400ba87f47595a1d123
*** Script: Number = RITM0115720
*** Script: Variable value = 56160cfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0115483
*** Script: Variable value = 16168cfc0079e400ba87f47595a1d1c2
*** Script: Number = RITM0110636
*** Script: Variable value = c1168cfc0079e400ba87f47595a1d123
*** Script: Number = RITM0092932
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0105827
*** Script: Variable value = b9168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0092913
*** Script: Variable value = fd284ff400f9e400ba87f47595a1d14d
*** Script: Number = RITM0113832
*** Script: Variable value = 10400
*** Script: Number = RITM0109459
*** Script: Variable value = 71168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0115718
*** Script: Variable value = 56160cfc0079e400ba87f47595a1d1b7
*** Script: Number = RITM0114953
*** Script: Variable value = 16168cfc0079e400ba87f47595a1d1c2
*** Script: Number = RITM0101878
*** Script: Variable value = 71168cfc0079e400ba87f47595a1d172
*** Script: Number = RITM0076886
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0083209
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
*** Script: Number = RITM0100608
*** Script: Variable value = 064869f059299940bdc4b3980d4b52fe
*** Script: Number = RITM0076868
*** Script: Variable value = e9168cfc0079e400ba87f47595a1d165
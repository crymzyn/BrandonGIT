new DiscoverySensor({
	process: function(result) {
				
		//gs.log('HELLLLLOOOOOO1',scriptTag); updated
		var scriptTag = 'SSL_Disco';
		gs.log('Start Sensor 1',scriptTag);
		
		var parser = new JSONParser();
		var output = parser.parse(result.output);
		var globalnewid = '';
		var blank = 'null';
		var ssltype = '';
		
		var maritzUtil = new MaritzDiscoveryFunctions();
		
		//gs.log('HELLLLLOOOOOO2',scriptTag);
		//gs.log('output length = ' + output.length,scriptTag);
		

		//#### BEGIN LOOPING THROUGH RETURNED SSL OBJECTS ####
		for (var count = 0; count < output.length; count++) {
			//gs.log('in for loop, count = ' + count,scriptTag);
			gs.sleep(3000);
			var u_sn_computername = output[count].ComputerName;
			var u_sn_thumbprint = output[count].Thumbprint;
			var u_sn_subjectcommon = output[count].SubjectCommonName;
			var u_sn_subjectorgunit = output[count].SubjectOrganizationalUnit;
			var u_sn_subjectorg = output[count].SubjectOrganization;
			var u_sn_subjectloc = output[count].SubjectLocation;
			var u_sn_subjectstate = output[count].SubjectState;
			var u_sn_subjectcountry = output[count].SubjectCountry;
			var u_sn_issuercommonname = output[count].IssuerCommonName;
			var u_sn_issuerorg = output[count].IssuerOrganization;
			var u_sn_expirationdate = output[count].ExpirationDate;
			var u_sn_creationdate = output[count].CreationDate;
			var u_sn_signalgoritm = output[count].SignatureAlgorithm;
			var u_sn_hasprivatekey = output[count].HasPrivateKey;
			var u_sn_boundaddress = output[count].BoundAddress;
			var u_sn_boundsite = output[count].BoundSite;
			
			var bsNil = JSUtil.nil(u_sn_boundsite);
			var baNil = JSUtil.nil(u_sn_boundaddress);
			
			
			var bsArray = [];
			var baArray = [];
			
			//var bs = '';
			//bs += u_sn_boundsite;
			//var bs1 = bs.trim();
			//gs.log('bs1:'+ bs1 ,scriptTag);
			
			if (!baNil) {
				baArray = u_sn_boundaddress;
				gs.log('length = ' + u_sn_boundaddress.length + ' & 1st entry = ' + u_sn_boundaddress[0],scriptTag);
			}
			else {
				gs.log('ba is null',scriptTag);
			}
			
			//var ba = '';
			//ba += u_sn_boundaddress;
			//var ba1 = ba.trim();
			//gs.log('ba1:'+ ba1 ,scriptTag);

			if (!bsNil) {
				bsArray = u_sn_boundsite;
				gs.log('length = ' + u_sn_boundsite.length + ' & 1st entry = ' + u_sn_boundsite[0],scriptTag);
			}
			else {
				gs.log('bs is null',scriptTag);
			}
			
			var sc = '';
			sc += u_sn_subjectcommon;
			var sc1 = sc.trim();
			//gs.log('sc1'+ sc1, scriptTag);
			
			var cn = '';
			cn += u_sn_computername;
			var cn1 = cn.trim();
			//gs.log('cn1:'+ cn1 ,scriptTag);
			
			var so = '';
			so += u_sn_subjectorg;
			var so1 = so.trim();
			
			var snlower = sc1.toString().toLowerCase();
			var cnlower = cn1.toString().toLowerCase();
			var companyorg = so1.toString().toLowerCase();
			
			
			//Find Website Type  and put into u_type
			if (bsNil) {
				
				//var snlower = sc.toLowerCase();
				//var cnlower = cn.toLowerCase();
				//gs.log('BBSERVER:'+ snlower,scriptTag);
				//gs.log('BBSERVER'+ cnlower,scriptTag);
				
				if (snlower.indexOf(cnlower) >= 0) {
					ssltype = 'Server';
					//gs.log('AASERVER:'+ snlower,scriptTag);
					//gs.log('AASERVER'+ cnlower,scriptTag);
				}
				else {
					ssltype = 'Application';
					//gs.log('snlowerAPP'+ snlower,scriptTag);
				}
				
			}
			
			else {
				ssltype = 'Web Site';
				//gs.log('scwebsite'+ sc,scriptTag);
			}
			gs.log('got past bs check',scriptTag);
			
			//get JSON date conversions
			var exp_sp1 = u_sn_expirationdate.split('(');
			var exp_sp2 = exp_sp1[1].split(')');
			var exp_temp = exp_sp2[0];
			var dtutil = new DateTimeUtils();
			var expdate = dtutil.cleanseJSONDate(exp_temp);
			var lessday = new GlideDateTime(expdate);
			lessday.addDaysLocalTime(-1);
			//gs.log('LESS DAY'+lessday,scriptTag);
			var plusday = new GlideDateTime(expdate);
			plusday.addDaysLocalTime(1);
			//gs.log('PLUS DAY'+plusday,scriptTag);
			//gs.log('expdateAAA'+ expdate,scriptTag);
			
			var cre_sp1 = u_sn_creationdate.split('(');
			var cre_sp2 = cre_sp1[1].split(')');
			var cre_temp = cre_sp2[0];
			var dtutil2 = new DateTimeUtils();
			var createdate = dtutil2.cleanseJSONDate(cre_temp);
			var today = gs.nowNoTZ(); //Used for Last Discovered Value on Form
			
			//##### FIRST CHECK FOR MATCH ON THUMBPRINT #####
			var checkSSLCI = new GlideRecord('u_ssl');
			var check2 = checkSSLCI.addQuery('u_sn_thumbprint', u_sn_thumbprint);
			check2.addOrCondition('u_certificate_thumbprint', u_sn_thumbprint);
			checkSSLCI.query();
			
			
			if (checkSSLCI.next()) {
				gs.log('1st match',scriptTag);
				//update
				//gs.log('FOUND1:' + 'tb',scriptTag);
				var total = checkSSLCI.getRowCount();
				//gs.log('all returned' + total, scriptTag);
				
				if (total > 1) {
					
					//gs.log('Create Ticket more 1 thumb' + total, scriptTag);
					var verify1 = new GlideRecord('incident');
					verify1.addQuery('short_description', "Duplicate Thumbprint:" + u_sn_thumbprint);
					verify1.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
					verify1.addQuery('active', '=', true);
					verify1.query();
					
					if (!verify1.next()) {
						
						var ticket1 = new GlideRecord('incident');
						ticket1.assignment_group = 'd5d6f4800009e000ba87f47595a1d103'; //A&I Services
						ticket1.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
						ticket1.u_event_start_date = today;
						ticket1.short_description = "Duplicate Thumbprint:" + u_sn_thumbprint;
						ticket1.description = "Duplicate Config SSL CI with same Thumbprint:" + u_sn_thumbprint;
						ticket1.contact_type = 'internally-identified';
						ticket1.category = 'Data';
						ticket1.subcategory = 'Data or file incorrect';
						ticket1.impact = '3';
						ticket1.urgency = '3';
						ticket1.insert();
					}
				}
				
				else {
					
					var return_sslname = checkSSLCI.name.toLowerCase().trim();
											
					
					//gs.log('Ticket not made', scriptTag);
					//gs.log('returnssl: ' + return_sslname,scriptTag);
					//gs.log('snlower: ' + snlower,scriptTag);
					//#### CHECK IF NAME MATCHES ####
					if (snlower == return_sslname) {
						
						//update
						checkSSLCI.setValue('u_sn_creationdate', createdate);
						checkSSLCI.setValue('u_sn_expirationdate', expdate);
						checkSSLCI.setValue('u_expiration_date', expdate);
						checkSSLCI.setValue('u_sn_hasprivatekey', u_sn_hasprivatekey);
						checkSSLCI.setValue('u_sn_issuercommonname', u_sn_issuercommonname);
						checkSSLCI.setValue('u_sn_issuerorg', u_sn_issuerorg);
						checkSSLCI.setValue('u_sn_signalgoritm', u_sn_signalgoritm);
						checkSSLCI.setValue('u_sn_subjectcommon', u_sn_subjectcommon);
						checkSSLCI.setValue('u_sn_subjectcountry', u_sn_subjectcountry);
						checkSSLCI.setValue('u_sn_subjectloc', u_sn_subjectloc);
						checkSSLCI.setValue('u_sn_subjectorg', u_sn_subjectorg);
						checkSSLCI.setValue('u_sn_subjectorgunit', u_sn_subjectorgunit);
						checkSSLCI.setValue('u_sn_subjectstate', u_sn_subjectstate);
						checkSSLCI.setValue('u_sn_thumbprint', u_sn_thumbprint);
						checkSSLCI.setValue('u_last_discovered', today);
						globalnewid = checkSSLCI.sys_id;
						checkSSLCI.update();
						
						
						//##### BEGIN RELATIONSHIP CHECK #####
						if (bsNil || baNil) {
							//##### BEGIN SERVER RELATIONSHIP #####
							//gs.log('INSIDEBOUND' + blank ,scriptTag);
							
							var parent = new GlideRecord('cmdb_ci_win_server');
							parent.addQuery('name', u_sn_computername);
							parent.addQuery('ip_address', source);
							parent.addQuery('active', true);
							parent.query();
							//gs.log('source: '+ source ,scriptTag);
							
							if (parent.next()) {
								maritzUtil.createRelationshipFromSysIds(parent.sys_id,globalnewid,'Contains::Contained by',today);
							}
							//##### END SERVER RELATIONSHIP #####
						}
						else {
							//##### BEGIN WEBSITE RELATIONSHIP #####
							//get website ip
							//var temp = u_sn_boundaddress.split(':');
							//var web_temp = temp[0];
							
							for (var ws = 0;ws < baArray.length;ws++) {
								var bs = bsArray[ws];
								var temp = baArray[ws].split(':');
								var web_temp = temp[0];
								var website = new GlideRecord('cmdb_ci_web_site');
								website.addQuery('name', bs);
								website.addQuery('ip_address', web_temp);
								website.query();
								
								var websitetotal1 = website.getRowCount();
								gs.log('querying website ci... total = ' + websitetotal1,scriptTag);
								if (websitetotal1 > 1) {
									//gs.log('POSTwebsite total:' + websitetotal1,scriptTag);
									//check for DUP before insert of INC*********************
									var webverify1 = new GlideRecord('incident');
									//webverify1.addQuery('short_description', 'CONTAINS',"SSL Boundsite more one website CI: " + bs);
									webverify1.addQuery('description', 'CONTAINS',"SSL Boundsite with more than one website CI: " + bs + " on server: " + cnlower);
									webverify1.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
									webverify1.addQuery('cmdb_ci', globalnewid);
									webverify1.addQuery('active', '=', true);
									webverify1.query();
									
									if (!webverify1.next()) {
										//gs.log('MAKE NEW TIX'+ hobo,scriptTag);
										var webticket1 = new GlideRecord('incident');
										webticket1.assignment_group = 'd5d6f4800009e000ba87f47595a1d103'; //A&I
										webticket1.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
										webticket1.u_event_start_date = today;
										webticket1.short_description = "SSL Boundsite > 1 website CI: " + bs; //Boundsite
										webticket1.description = "SSL Boundsite with more than one website CI: " + bs + " on server: " + cnlower;
										webticket1.contact_type = 'internally-identified';
										webticket1.category = 'Data';
										webticket1.subcategory = 'Data or file incorrect';
										webticket1.impact = '3';
										webticket1.urgency = '3';
										webticket1.cmdb_ci = globalnewid;
										webticket1.insert();
									}
									
								}
								else {
									
									if (website.next()) {											///ssltype check
										var precheck = new GlideRecord('u_ssl');
										precheck.addQuery('sys_id', globalnewid);
										precheck.query();
										
										if (precheck.next()) {
											if (precheck.u_type != 'Web Site') {
												precheck.setValue('u_type', 'Web Site');
												precheck.update();
											}
										}
										maritzUtil.createRelationshipFromSysIds(website.sys_id,globalnewid,'Contains::Contained by',today);	
										
											
										//##### BEGIN URL RELATIONSHIP #####
										var url = new GlideRecord('cmdb_rel_ci');
										url.addQuery('parent', website.sys_id);
										url.addQuery('child.sys_class_name', 'u_url');
										url.query();
										if (url.next()) {
											
											var urlid = url.child;
											//gs.log('url:' + urlid,scriptTag);
											//gs.log('class:' + u_url,scriptTag);
											
											maritzUtil.createRelationshipFromSysIds(globalnewid,urlid,'Contains::Contained by',today);	
										}
										else {
												
											//gs.log('OPEN INC WEBSITE NO URL ASSOC',scriptTag);
											
											//check for DUP before insert of INC*********************
											var verify3 = new GlideRecord('incident');
											verify3.addQuery('short_description', "Website with NO URL Associated: " + bs);
											verify3.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
											verify3.addQuery('cmdb_ci', website.sys_id);
											verify3.addQuery('active', '=', true);
											verify3.query();
											
											if (!verify3.next()) {
												
												var ticket3 = new GlideRecord('incident');
												ticket3.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
												ticket3.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
												ticket3.u_event_start_date = today;
												ticket3.short_description = "Website with NO URL Associated: " + bs; //Boundsite
												ticket3.description = "Website with NO URL Associated:" + bs;
												ticket3.contact_type = 'internally-identified';
												ticket3.category = 'Data';
												ticket3.subcategory = 'Data or file incorrect';
												ticket3.impact = '3';
												ticket3.urgency = '3';
												ticket3.cmdb_ci = website.sys_id;
												ticket3.insert();
											}
										}
										//##### END URL RELATIONSHIP
									}
								}
							}
							//##### END WEBSITE RELATIONSHIP #####
						}
						//##### END RELATIONSHIP CHECK #####
						gs.log('survived name match!',scriptTag);
					} 
					
					//#### IF NAME DOESN'T MATCH, OPEN TICKET ####
					else {							
						//check for DUP before insert of INC*********************
						globalnewid = checkSSLCI.sys_id;
						var verify2 = new GlideRecord('incident');
						verify2.addQuery('short_description', "SSL CI Name Mismatch:" + u_sn_subjectcommon + " Host Name: " + cnlower);
						verify2.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
						verify2.addQuery('cmdb_ci', globalnewid);
						verify2.addQuery('active', '=', true);
						verify2.query();
						
						if (!verify2.next()) {
							
							var ticket2 = new GlideRecord('incident');
							ticket2.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
							ticket2.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
							ticket2.u_event_start_date = today;
							ticket2.short_description = "SSL CI Name Mismatch:" + u_sn_subjectcommon + " Host Name: " + cnlower;
							ticket2.description = "SSL CI Name and Cert Name Don't Match: " + u_sn_subjectcommon + " loaded on server CI " + cnlower;
							ticket2.contact_type = 'internally-identified';
							ticket2.category = 'Data';
							ticket2.subcategory = 'Data or file incorrect';
							ticket2.impact = '3';
							ticket2.urgency = '3';
							ticket2.cmdb_ci = globalnewid;
							ticket2.insert();
						}
					}
				}
			}
			//#### MATCH ON THUMBPRINT END ####

			//#### NO MATCH ON THUMBPRINT - OTHER CHECKS ####
			else {
				gs.log('1st no match',scriptTag);
				//##### 1ST NO MATCH ON THUMBPRINT SCENARIO: MATCH ON EXP DATE AND NAME #####
				var gdt = new GlideDateTime(expdate);
				var expgtd = (gdt.getDate()); //return just 2015-08-12  no time
				//gs.log('expdate:' + expgtd,scriptTag);
				
				
				var check2SSLCI = new GlideRecord('u_ssl');
				check2SSLCI.addQuery('name', u_sn_subjectcommon);
				check2SSLCI.addQuery('u_expiration_date', '<=', plusday);
				check2SSLCI.addQuery('u_expiration_date', '>=', lessday);
				//check2SSLCI.addQuery('u_active', true);
				check2SSLCI.query();
				
				
				
				if (check2SSLCI.next()) {
						
						
					var total2 = check2SSLCI.getRowCount();
					//gs.log('all returned' + total2, scriptTag);

					//#### IF MORE THAN ONE, OPEN TICKET ####
					if (total2 > 1) {
						
						//gs.log('Create Ticket more 1 SCN' + total2, scriptTag);
						var verify2a = new GlideRecord('incident');
						verify2a.addQuery('short_description', "Dup SubjectCommonName: " + u_sn_subjectcommon + " and Expiration Date: " + expgtd);
						verify2a.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
						verify2a.addQuery('active', '=', true);
						verify2a.query();
						
						if (!verify2a.next()) {
							
							var ticket2a = new GlideRecord('incident');
							ticket2a.assignment_group = 'd5d6f4800009e000ba87f47595a1d103'; //A&I Services
							ticket2a.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
							ticket2a.u_event_start_date = today;
							ticket2a.short_description = "Dup SubjectCommonName: " + u_sn_subjectcommon + " and Expiration Date: " + expgtd;
							ticket2a.description = "Dup Config SSL CIs with the same SubjectCommonName: " + u_sn_subjectcommon + " and Expiration Date: " + expgtd;
							ticket2a.contact_type = 'internally-identified';
							ticket2a.category = 'Data';
							ticket2a.subcategory = 'Data or file incorrect';
							ticket2a.impact = '3';
							ticket2a.urgency = '3';
							ticket2a.insert();
						}
					}
					else {
						
						var disconull = JSUtil.nil(check2SSLCI.u_sn_thumbprint);
						var discothumb = check2SSLCI.u_sn_thumbprint;
						gs.log('null' + disconull,scriptTag);	
						gs.log('existthumb' + discothumb,scriptTag);
						gs.log('sysid' + check2SSLCI.sys_id,scriptTag);	
						if (disconull == true) {
						
						check2SSLCI.setValue('u_sn_creationdate', createdate);
						check2SSLCI.setValue('u_sn_expirationdate', expdate);
						check2SSLCI.setValue('u_expiration_date', expdate);
						check2SSLCI.setValue('u_sn_hasprivatekey', u_sn_hasprivatekey);
						check2SSLCI.setValue('u_sn_issuercommonname', u_sn_issuercommonname);
						check2SSLCI.setValue('u_sn_issuerorg', u_sn_issuerorg);
						check2SSLCI.setValue('u_sn_signalgoritm', u_sn_signalgoritm);
						check2SSLCI.setValue('u_sn_subjectcommon', u_sn_subjectcommon);
						check2SSLCI.setValue('u_sn_subjectcountry', u_sn_subjectcountry);
						check2SSLCI.setValue('u_sn_subjectloc', u_sn_subjectloc);
						check2SSLCI.setValue('u_sn_subjectorg', u_sn_subjectorg);
						check2SSLCI.setValue('u_sn_subjectorgunit', u_sn_subjectorgunit);
						check2SSLCI.setValue('u_sn_subjectstate', u_sn_subjectstate);
						check2SSLCI.setValue('u_sn_thumbprint', u_sn_thumbprint);
						check2SSLCI.setValue('u_last_discovered', today);
						globalnewid = check2SSLCI.sys_id;
						check2SSLCI.update();
						} else {
							
						var check2SSLCII = new GlideRecord('u_ssl');
						check2SSLCII.setValue('u_sn_creationdate', createdate);
						check2SSLCII.setValue('u_sn_expirationdate', expdate);
						check2SSLCII.setValue('u_expiration_date', expdate);
						check2SSLCII.setValue('u_sn_hasprivatekey', u_sn_hasprivatekey);
						check2SSLCII.setValue('u_sn_issuercommonname', u_sn_issuercommonname);
						check2SSLCII.setValue('u_sn_issuerorg', u_sn_issuerorg);
						check2SSLCII.setValue('u_sn_signalgoritm', u_sn_signalgoritm);
						check2SSLCII.setValue('u_sn_subjectcommon', u_sn_subjectcommon);
						check2SSLCII.setValue('u_sn_subjectcountry', u_sn_subjectcountry);
						check2SSLCII.setValue('u_sn_subjectloc', u_sn_subjectloc);
						check2SSLCII.setValue('u_sn_subjectorg', u_sn_subjectorg);
						check2SSLCII.setValue('u_sn_subjectorgunit', u_sn_subjectorgunit);
						check2SSLCII.setValue('u_sn_subjectstate', u_sn_subjectstate);
						check2SSLCII.setValue('u_sn_thumbprint', u_sn_thumbprint);
						check2SSLCII.setValue('name', u_sn_subjectcommon);
						check2SSLCII.setValue('install_status', '101');
						check2SSLCII.setValue('support_group', '4ed6f4800009e000ba87f47595a1d1d8'); //Windows Server Ops
						check2SSLCII.setValue('u_last_discovered', today);
						check2SSLCII.setValue('u_type', ssltype);
						check2SSLCII.setValue('u_owner', owner);
						var newid4 = check2SSLCII.insert();
						globalnewid = newid4;
						check2SSLCII.insert(); 
						
						var verifynull = new GlideRecord('incident');
						verifynull.addQuery('short_description', "Diff Thumbprint w/ same name: " + u_sn_subjectcommon + " and Exp Date: " + expgtd);
						verifynull.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
						verifynull.addQuery('active', '=', true);
						verifynull.query();
						
						if (!verifynull.next()) {
							
							var ticketnull = new GlideRecord('incident');
							ticketnull.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops
							ticketnull.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
							ticketnull.u_event_start_date = today;
							ticketnull.short_description = "Diff Thumbprint w/ same name: " + u_sn_subjectcommon + " and Exp Date: " + expgtd;
							ticketnull.description = "Different Thumbprint same name: " + u_sn_subjectcommon + " and Expiration Date: " + expgtd + " Discovery Thumbprint: " + u_sn_thumbprint + " Existing Thumbprint: " + discothumb;
							ticketnull.contact_type = 'internally-identified';
							ticketnull.category = 'Data';
							ticketnull.subcategory = 'Data or file incorrect';
							ticketnull.impact = '3';
							ticketnull.urgency = '3';
							ticketnull.cmdb_ci = globalnewid;
							ticketnull.insert();
						}
											
						}
							
												
						if (bsNil || baNil) {
							//#### BEGIN SERVER RELATIONSHIP ####

							//gs.log('INSIDEBOUND' + blank ,scriptTag);
							//gs.log('BS1111' + bs1 ,scriptTag);
							//gs.log('BA1111D' + ba1 ,scriptTag);
							var parent2 = new GlideRecord('cmdb_ci_win_server');
							parent2.addQuery('name', u_sn_computername);
							parent2.addQuery('ip_address', source);
							parent2.addQuery('active', true);
							parent2.query();
							
							
							if (parent2.next()) {
								maritzUtil.createRelationshipFromSysIds(parent2.sys_id,globalnewid,'Contains::Contained by',today);
							}
							//#### END SERVER RELATIONSHIP ####
						} 
						else {
							//#### BEGIN WEBSITE RELATIONSHIP ####
							for (var ws2 = 0;ws2 < baArray.length;ws2++) {
								//get website ip
								//var temp2 = u_sn_boundaddress.split(':');
								//var web_temp2 = temp2[0];
								var bs2 = bsArray[ws2];
								var temp2 = baArray[ws2].split(':');
								var web_temp2 = temp2[0];
									
								var website2 = new GlideRecord('cmdb_ci_web_site');
								website2.addQuery('name', bs2);
								website2.addQuery('ip_address', web_temp2);
								website2.query();
							
								var websitetotal2 = website2.getRowCount();
							
								if (websitetotal2 > 1) {
									gs.log('POSTwebsite total:' + websitetotal2,scriptTag);
									//check for DUP before insert of INC*********************
									var webverify2 = new GlideRecord('incident');
									//webverify2.addQuery('short_description', "SSL Boundsite > 1 website CI: " + bs);
									webverify2.addQuery('description', 'CONTAINS', "SSL Boundsite with more than one website CI: " + bs2 + " on server: " + cnlower);
									webverify2.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
									webverify2.addQuery('cmdb_ci', globalnewid);
									webverify2.addQuery('active', '=', true);
									webverify2.query();
								
									if (!webverify2.next()) {
										
										var webticket2 = new GlideRecord('incident');
										webticket2.assignment_group = 'd5d6f4800009e000ba87f47595a1d103'; //A&I
										webticket2.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
										webticket2.u_event_start_date = today;
										webticket2.short_description = "SSL Boundsite > 1 website CI: " + bs2; //Boundsite
										webticket2.description = "SSL Boundsite with more than one website CI: " + bs2 + " on server: " + cnlower;
										webticket2.contact_type = 'internally-identified';
										webticket2.category = 'Data';
										webticket2.subcategory = 'Data or file incorrect';
										webticket2.impact = '3';
										webticket2.urgency = '3';
										webticket2.cmdb_ci = globalnewid;
										webticket2.insert();
									}
								} 
								else {
										
									if (website2.next()) {
										maritzUtil.createRelationshipFromSysIds(website2.sys_id,globalnewid,'Contains::Contained by',today);
										
										//#### BEGIN URL RELATIONSHIP ####
										var url2 = new GlideRecord('cmdb_rel_ci');
										url2.addQuery('parent', website2.sys_id);
										url2.addQuery('child.sys_class_name', 'u_url');
										url2.query();
										if (url2.next()) {
											var urlid2 = url2.child;
											//gs.log('url2:' + urlid2,scriptTag);
											//gs.log('class:' + u_url,scriptTag);
											
											maritzUtil.createRelationshipFromSysIds(globalnewid,urlid2,'Contains::Contained by',today);
										}  

										else {
											//gs.log('INC NO URL RELATIONSHIP TICKET 4',scriptTag);
											
											var verify4 = new GlideRecord('incident');
											verify4.addQuery('short_description', "Website with NO URL Associated: " + bs2);
											verify4.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
											verify4.addQuery('cmdb_ci', '=', website2.sys_id);
											verify4.addQuery('active', '=', true);
											verify4.query();
											
											if (!verify4.next()) {
												var ticket4 = new GlideRecord('incident');
												ticket4.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
												ticket4.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
												ticket4.u_event_start_date = today;
												ticket4.short_description = "Website with NO URL Associated: " + bs2;
												ticket4.description = "Website: " + bs2 + " Relationship to URL doesn't exist.";
												ticket4.contact_type = 'internally-identified';
												ticket4.category = 'Data';
												ticket4.subcategory = 'Data or file incorrect';
												ticket4.impact = '3';
												ticket4.urgency = '3';
												ticket4.cmdb_ci = website2.sys_id;
												ticket4.insert();
											}
										}  
										//#### END URL RELATIONSHIP ####
									}
								}
							}
							//#### END WEBSITE RELATIONSHIP ####
						}
					}
				}
				//#### 1ST NO MATCH ON THUMBPRINT SCENARIO END ####

				//#### 2ND NO MATCH ON THUMBPRINT SCENARIO: NO MATCH ON EXP DATE/NAME >> CREATE NEW SSL CI ####
				else {
					gs.log('2nd no match',scriptTag);
					//create new CI
					//gs.log('companyorg: '+ companyorg,scriptTag);
					var owner = '';
					var detailsclient = (companyorg.indexOf("maritz") > -1);
					if (detailsclient == true) {
						owner = "Maritz";
						//gs.log('owner is maritz: '+ owner + ' ' + detailsclient,scriptTag);
					} 
					else {
						owner = "";
						//gs.log('owner is none: '+ owner + ' ' + detailsclient,scriptTag);
					}
						
					var check3SSLCI = new GlideRecord('u_ssl');
					
					check3SSLCI.initialize();
					//var newid = check3SSLCI.sys_id;
					//gs.log('newid:' + newid,scriptTag);
					check3SSLCI.setValue('u_sn_creationdate', createdate);
					check3SSLCI.setValue('u_sn_expirationdate', expdate);
					check3SSLCI.setValue('u_expiration_date', expdate);
					check3SSLCI.setValue('u_sn_hasprivatekey', u_sn_hasprivatekey);
					check3SSLCI.setValue('u_sn_issuercommonname', u_sn_issuercommonname);
					check3SSLCI.setValue('u_sn_issuerorg', u_sn_issuerorg);
					check3SSLCI.setValue('u_sn_signalgoritm', u_sn_signalgoritm);
					check3SSLCI.setValue('u_sn_subjectcommon', u_sn_subjectcommon);
					check3SSLCI.setValue('u_sn_subjectcountry', u_sn_subjectcountry);
					check3SSLCI.setValue('u_sn_subjectloc', u_sn_subjectloc);
					check3SSLCI.setValue('u_sn_subjectorg', u_sn_subjectorg);
					check3SSLCI.setValue('u_sn_subjectorgunit', u_sn_subjectorgunit);
					check3SSLCI.setValue('u_sn_subjectstate', u_sn_subjectstate);
					check3SSLCI.setValue('u_sn_thumbprint', u_sn_thumbprint);
					check3SSLCI.setValue('name', u_sn_subjectcommon);
					check3SSLCI.setValue('install_status', '101');
					check3SSLCI.setValue('support_group', '4ed6f4800009e000ba87f47595a1d1d8'); //Windows Server Ops
					check3SSLCI.setValue('u_last_discovered', today);
					check3SSLCI.setValue('u_type', ssltype);
					check3SSLCI.setValue('u_owner', owner);
					var newid3 = check3SSLCI.insert();
					globalnewid = newid3;
					//gs.log('newid3:' + newid3,scriptTag);
						
					if (bsNil || baNil) {
						//#### BEGIN SERVER RELATIONSHIP ####
						//gs.log('INSIDEBOUND' + blank ,scriptTag);
						var parent3 = new GlideRecord('cmdb_ci_win_server');
						parent3.addQuery('name', u_sn_computername);
						parent3.addQuery('ip_address', source);
						parent3.addQuery('active', true);
						parent3.query();
						
						if (parent3.next()) {
							maritzUtil.createRelationshipFromSysIds(parent3.sys_id,globalnewid,'Contains::Contained by',today);
						}  
						//#### END SERVER RELATIONSHIP ####
					} 
					else {
						//##### BEGIN WEBSITE RELATIONSHIP #####
						for(var ws3 = 0;ws3 < baArray.length;ws3++) {
							//get website ip
							//var temp3 = u_sn_boundaddress.split(':');
							//var web_temp3 = temp3[0];
							var bs3 = bsArray[ws3];
							var temp3 = baArray[ws3].split(':');
							var web_temp3 = temp3[0];	
								
							var website3 = new GlideRecord('cmdb_ci_web_site');
							website3.addQuery('name', bs3);
							website3.addQuery('ip_address', web_temp3);
							website3.query();

							var websitetotal3 = website3.getRowCount();
							
							if (websitetotal3 > 1) {
								gs.log('POSTwebsite total:' + websitetotal3,scriptTag);
								//check for DUP before insert of INC
								var webverify3 = new GlideRecord('incident');
								//webverify3.addQuery('short_description', "SSL Boundsite > 1 website CI: " + bs);
								webverify3.addQuery('description','CONTAINS', "SSL Boundsite with more than one website CI: " + bs3 + " on server: " + cnlower);
								webverify3.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
								webverify3.addQuery('cmdb_ci', globalnewid);
								webverify3.addQuery('active', '=', true);
								webverify3.query();
								
								if (!webverify3.next()) {	
									var webticket3 = new GlideRecord('incident');
									webticket3.assignment_group = 'd5d6f4800009e000ba87f47595a1d103'; //A&I
									webticket3.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
									webticket3.u_event_start_date = today;
									webticket3.short_description = "SSL Boundsite > 1 website CI: " + bs3; //Boundsite
									webticket3.description = "SSL Boundsite with more than one website CI: " + bs3 + " on server: " + cnlower;
									webticket3.contact_type = 'internally-identified';
									webticket3.category = 'Data';
									webticket3.subcategory = 'Data or file incorrect';
									webticket3.impact = '3';
									webticket3.urgency = '3';
									webticket3.cmdb_ci = globalnewid;
									webticket3.insert();
								}
								
							} 
							else {
								
								if (website3.next()) {
									maritzUtil.createRelationshipFromSysIds(website3.sys_id,globalnewid,'Contains::Contained by',today);

									//#### BEGIN URL RELATIONSHIP ####
									var url3 = new GlideRecord('cmdb_rel_ci');
									url3.addQuery('parent', website3.sys_id);
									url3.addQuery('child.sys_class_name', 'u_url');
									url3.query();
									if (url3.next()) {
										var urlid3 = url3.child;
										//gs.log('url3:' + urlid3,scriptTag);
										//gs.log('class:' + u_url,scriptTag);
										
										maritzUtil.createRelationshipFromSysIds(globalnewid,urlid3,'Contains::Contained by',today);	
									}
									else {
										//gs.log('INC3333333333333333',scriptTag);
										
										var verify5 = new GlideRecord('incident');
										verify5.addQuery('short_description', "Website with NO URL Associated: " + bs3);
										verify5.addQuery('caller_id', '0a9cfdb32b1dcec0f40a59efe8da1566');
										verify5.addQuery('cmdb_ci', website3.sys_id);
										verify5.addQuery('active', '=', true);
										verify5.query();
										
										if (!verify5.next()) {
											
											var ticket5 = new GlideRecord('incident');
											ticket5.assignment_group = '4ed6f4800009e000ba87f47595a1d1d8'; //Windows Server Ops Operations
											ticket5.caller_id = '0a9cfdb32b1dcec0f40a59efe8da1566'; //Discovery
											ticket5.u_event_start_date = today;
											ticket5.short_description = "Website with NO URL Associated: " + bs3;
											ticket5.description = "Website: " + bs3 + " Relationship to URL doesn't exist.";
											ticket5.contact_type = 'internally-identified';
											ticket5.category = 'Data';
											ticket5.subcategory = 'Data or file incorrect';
											ticket5.impact = '3';
											ticket5.urgency = '3';
											ticket5.cmdb_ci = website3.sys_id;
											ticket5.insert();
										}
									}
									//#### END URL RELATIONSHIP ####
								}
							}
						}
						//#### END WEBSITE RELATIONSHIP ####	
					}
				}
				//#### 2ND NO MATCH ON THUMBPRINT SCENARIO END ####
			}
			//#### NO MATCH ON THUMBPRINT END ####	
		}
		//#### END LOOPING THROUGH RETURNED SSL OBJECTS ####
	},

	type: "DiscoverySensor "
});
try {

var requestBody;
var responseBody;
var status_id;
var sm;
var query = "SELECT DATEFORMAT(startTime, 'YYYY-MM-dd HH:mm:ss') as StartTime, LogSourceName(logsourceid) as LogSource, Security_ID as SecurityID, ObjectPath as ObjectName, Accesses FROM events WHERE (qid = 5000850 OR qid = 5000844) AND creEventList = 112073 ORDER BY LogSource ASC START '2015-07-08 00:00' STOP '2015-07-09 00:00'"

//gs.log('BSY --> query = ' + query);


sm = new RESTMessageScripted("post","https://10.99.10.22/api/ariel/searches");
sm.setMIDServer('FENAPPMGP07_Dev');
sm.addHeader("SEC","7de3c2ee-f948-40c7-8300-abf1d6562b4b");
sm.addHeader("Accept","application/json");
sm.addRequestParameter("query_expression",query.toString());
//sm.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.


sm.execute();

 var k = 1;
  var response = sm.getResponse();
  while (response == null) {
      gs.log("waiting ... " + k + " seconds");
      response = sm.getResponse(1000); //wait 1 second before looking for the response
      k++;

      if (k > 30) {
          break; // service did not respond after 30 tries
      }
  }
 
//gs.log('BSY --> have error? - ' + response.getErrorMessage() + ' status_id = ' + response.getStatusCode());

responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
  status_id = response.getStatusCode();
} catch(ex) {
  responseBody = ex.getMessage();
  status_id = '500';
} finally {
    requestBody = sm.getRequestBody();
}
//gs.log("Request Body: " + requestBody);
gs.log("Response: " + responseBody);
gs.log("HTTP Status: " + status_id);

//expand JSON string to object
var inbound = new JSONParser();
var searchReturn = inbound.parse(responseBody);

var search_id = searchReturn.search_id;
gs.log('SEARCH ID = ' + search_id);

//############# NOW LOOK UP SEARCH ID STATUS, LOOP UNTIL COMPLETE #########################
var status_check = false;
var breaker = 0;
do {
    
  try {

  var requestBody_search;
  var responseBody_search;
  var status_search;
  var search;
  

  search = new RESTMessageScripted("post","https://10.99.10.22/api/ariel/searches/" + search_id);
  search.setMIDServer('FENAPPMGP07_Dev');
  search.addHeader("SEC","7de3c2ee-f948-40c7-8300-abf1d6562b4b");
  search.addHeader("Accept","application/json");
  //search.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.


  search.execute();

   var n = 1;
    var response_search = search.getResponse();
    while (response_search == null) {
        gs.log("waiting ... " + n + " seconds");
        response_search = search.getResponse(1000); //wait 1 second before looking for the response
        n++;

        if (n > 30) {
            break; // service did not respond after 30 tries
        }
    }
   
  //gs.log('BSY --> have error? - ' + response_search.getErrorMessage() + ' status_search = ' + response_search.getStatusCode());

  responseBody_search = response_search.haveError() ? response_search.getErrorMessage() : response_search.getBody();
    status_search = response_search.getStatusCode();
  } catch(ex) {
    responseBody_search = ex.getMessage();
    status_search = '500';
  } finally {
      requestBody_search = search.getRequestBody();
  }
  //gs.log("Request Body: " + requestBody_search);
  gs.log("Response: " + responseBody_search);
  gs.log("HTTP Status: " + status_search);

  //expand JSON string to object
  var inbound_search = new JSONParser();
  var searchReturn_search = inbound_search.parse(responseBody_search);

  var search_status = searchReturn_search.status;
  gs.log('SEARCH STATUS = ' + search_status);

  breaker = breaker + 1;

  if (search_status == 'COMPLETED' || breaker > 30) {
    status_check = true;
  }
}
while (status_check == false);

gs.log('COMPLETED or timed out');

//################## ONCE COMPLETE, MOVE ON TO PULL RECORDS #######################

var status_check2 = false;
var breaker2 = 0;
do {
    
  try {

  var requestBody_search;
  var responseBody_search;
  var status_search;
  var list;


  list = new RESTMessageScripted("get","https://10.99.10.22/api/ariel/searches/" + search_id + "/results");
  list.setMIDServer('FENAPPMGP07_Dev');
  list.addHeader("SEC","7de3c2ee-f948-40c7-8300-abf1d6562b4b");
  list.addHeader("Accept","application/json");
  //list.setHttpTimeout(10000); //In milliseconds. Wait at most 10 seconds for response from http request.


  list.execute();

   var m = 1;
    var response_list = list.getResponse();
    while (response_list == null) {
        gs.log("waiting ... " + m + " seconds");
        response_list = list.getResponse(1000); //wait 1 second before looking for the response
        m++;

        if (m > 30) {
            break; // service did not respond after 30 tries
        }
    }
   
  //gs.log('BSY --> have error? - ' + response_list.getErrorMessage() + ' status_list = ' + response_list.getStatusCode());

  responseBody_list = response_list.haveError() ? response_list.getErrorMessage() : response_list.getBody();
    status_list = response_list.getStatusCode();
  } catch(ex) {
    responseBody_list = ex.getMessage();
    status_list = '500';
  } finally {
      requestBody_list = list.getRequestBody();
  }
  //gs.log("Request Body: " + requestBody_list);
  gs.log("Response: " + responseBody_list);
  gs.log("HTTP Status: " + status_list);

  //expand JSON string to object
  var inbound_list = new JSONParser();
  var searchReturn_list = inbound_list.parse(responseBody_list);

  var result_list = searchReturn_list.status;
  gs.log('RESULT LIST = ' + result_list);

  breaker2 = breaker2 + 1;

  if (result_list.getElementsByTagName("events").length > 0 || breaker2 > 30) {
    status_check2 = true;
  }
}
while (status_check2 == false);

gs.log('Results found or timed out.');
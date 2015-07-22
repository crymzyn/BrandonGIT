try {

var requestBody;
var responseBody;
var status;
var sm;
var query = "SELECT DATEFORMAT(startTime, 'YYYY-MM-dd HH:mm:ss') as StartTime, LogSourceName(logsourceid) as LogSource, Security_ID as SecurityID, ObjectPath as ObjectName, Accesses FROM events WHERE (qid = 5000850 OR qid = 5000844) AND creEventList = 112073 ORDER BY LogSource ASC START '2015-07-08 00:00' STOP '2015-07-09 00:00'"

gs.log('BSY --> query = ' + query);


sm = new RESTMessage("https://10.99.10.22/api/ariel/searches/","post");
sm.setMIDServer('FENAPPMGP07_Dev');
sm.setRequestHeader("SEC","7de3c2ee-f948-40c7-8300-abf1d6562b4b");
sm.setRequestHeader("Accept","application/json");
sm.setStringParameter("query_expression",query);
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
 
gs.log('BSY --> have error? - ' + response.getErrorMessage() + ' status = ' + response.getStatusCode());

responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
  status = response.getStatusCode();
} catch(ex) {
  responseBody = ex.getMessage();
  status = '500';
} finally {
  requestBody = sm ? sm.getRequestBody():null;
}
gs.log("Request Body: " + requestBody);
gs.log("Response: " + responseBody);
gs.log("HTTP Status: " + status);

//V2 NOT AVAILABLE IN EUREKA!!! WON'T WORK!!!

try {

var requestBody;
var responseBody;
var status;
var sm;
var query = "SELECT DATEFORMAT(startTime, 'YYYY-MM-dd HH:mm:ss') as StartTime, LogSourceName(logsourceid) as LogSource, Security_ID as SecurityID, ObjectPath as ObjectName, Accesses FROM events WHERE (qid = 5000850 OR qid = 5000844) AND creEventList = 112073 ORDER BY LogSource ASC START '2015-07-08 00:00' STOP '2015-07-09 00:00'"

gs.log('BSY --> query = ' + query);


sm = new RESTMessageV2();
sm.setMIDServer('FENAPPMGP07_Dev');
sm.setHttpMethod("get");
sm.setEndpoint("https://10.99.10.22/api/ariel/searches/");
sm.setRequestHeader("SEC","7de3c2ee-f948-40c7-8300-abf1d6562b4b");
sm.setRequestHeader("Accept","application/json");
sm.setStringParameter("query_expression",query);
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
 
gs.log('BSY --> have error? - ' + response.getErrorMessage() + ' status = ' + response.getStatusCode());

responseBody = response.haveError() ? response.getErrorMessage() : response.getBody();
  status = response.getStatusCode();
} catch(ex) {
  responseBody = ex.getMessage();
  status = '500';
} finally {
  requestBody = sm ? sm.getRequestBody():null;
}
gs.log("Request Body: " + requestBody);
gs.log("Response: " + responseBody);
gs.log("HTTP Status: " + status);
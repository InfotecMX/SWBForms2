<%-- 
    Document   : index
    Created on : Dec 15, 2013, 5:30:59 PM
    Author     : javier.solis.g
--%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script src="/swbforms/js/eng.js" type="text/javascript"></script>
    </head>
    <body>
        <h1>Hello World!</h1>
        <script type="text/javascript">
            eng.initPlatform("/test/datasources.js");
        </script>        
        <pre>
<%
    DataObject user=(DataObject)session.getAttribute("_USER_");
    
%>        
        </pre>
    </body>
</html>

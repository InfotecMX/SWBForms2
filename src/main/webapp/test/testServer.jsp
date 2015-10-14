<%-- 
    Document   : testServer
    Created on : 14-oct-2015, 17:42:06
    Author     : javiersolis
--%>

<%@page import="org.semanticwb.datamanager.DataObject"%>
<%@page import="org.semanticwb.datamanager.SWBDataSource"%>
<%@page import="org.semanticwb.datamanager.SWBScriptEngine"%>
<%@page import="org.semanticwb.datamanager.DataMgr"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <pre>
        <%
    //DataObject user = (DataObject) session.getAttribute("_USER_");
    SWBScriptEngine engine = DataMgr.getUserScriptEngine("/test/datasources.js", null,false);
    SWBDataSource ds=engine.getDataSource("Pais");
    
    //Fetch
    DataObject query=new DataObject();
    DataObject data=new DataObject();
    query.put("data", data);
    data.put("abre", "mx");
    
    DataObject obj=ds.fetch(query);
    
    out.println(obj);
    out.println(obj.getDataObject("response").getDataList("data").getDataObject(0).getString("nombre"));
    
    //Add    
    DataObject newobj=new DataObject();
    newobj.put("nombre","jei5");
    newobj.put("abre","jj");    
    out.println(newobj);
    newobj=ds.addObj(newobj).getDataObject("response").getDataObject("data");
    out.println(newobj);
    
    //Update
    newobj.put("nombre","jei6");
    newobj=ds.updateObj(newobj).getDataObject("response").getDataObject("data");
    out.println(newobj);
    
    //Remove
    out.println(ds.removeObjById(newobj.getId()));    
    
   
        %>
</pre>
    </body>
</html>

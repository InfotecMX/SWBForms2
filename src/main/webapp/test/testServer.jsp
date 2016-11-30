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
    SWBScriptEngine engine = DataMgr.initPlatform("/test/datasources.js", session); 
    DataObject user = engine.getUser();
    
    SWBDataSource ds=engine.getDataSource("Pais");
    
    //Fetch
    DataObject query=new DataObject();

    //paginar opcional startRow, endRow
    query.addParam("startRow", 0).addParam("endRow", 10);

    //DataObject data=new DataObject();
    //query.put("data", data);
    //data.put("abre", "mx");
    // O en una sola linea
    query.addSubObject("data").addParam("abre", "mx");
    
    //textMatchStyle: substring, startsWith
    //query.addParam("textMatchStyle", "startsWith");
    //query.addSubObject("data").addParam("abre", "mx");    //todos los registros que inicien con mx en abre
    
    //o pueden usar expresiones regulares
    //query.addSubObject("data").addSubObject("abre").addParam("$regex", "^mx");
        
    DataObject obj=ds.fetch(query);
    
    out.println(obj);
 /*
    Respuesta
{
    "response":{
        "startRow":0, 
        "data":[
            {"abre":"mx", "_id":"_suri:SWBF2:Pais:561d5602d4c6a8eda771a0ac", "nombre":"México"}, 
            {"abre":"mx", "_id":"_suri:SWBF2:Pais:561d5aa7d4c6a8eda771a0ae", "nombre":"Jei"}
        ], 
        "endRow":2, 
        "totalRows":2, 
        "status":0
    }
}
 */     
    out.println("totalRows:"+obj.getDataObject("response").getLong("totalRows"));
    out.println("data.size():"+obj.getDataObject("response").getDataList("data").size());
    
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

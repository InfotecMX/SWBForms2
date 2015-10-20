<%-- 
    Document   : bor.jsp
    Created on : 19-oct-2015, 16:17:01
    Author     : javiersolis
--%>

<%@page import="org.semanticwb.datamanager.DataList"%>
<%@page import="org.semanticwb.datamanager.DataObject"%>
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
   DataObject obj=new DataObject();
   DataList list=new DataList();
   list.add("hola");
   list.add(123);
   list.add(true);
   DataObject obj2=new DataObject();
   obj2.put("sub","level");
   list.add(obj2);
   obj.put("hola", "Jei");
   obj.put("int", 1234);
   obj.put("float", 23.56F);
   obj.put("bool", true);
   obj.put("double", 23.4);
   obj.put("list", list);
   
   out.print(obj);
%>        
        </pre>
    </body>
</html>

<%@page import="org.semanticwb.datamanager.*"%><%
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    System.out.println(email+" "+password);
    if(email!=null && password!=null)
    {
        SWBScriptEngine engine=DataMgr.getUserScriptEngine("/test/datasources.js",null);
        SWBDataSource ds=engine.getDataSource("User");  
        DataObject r=new DataObject();
        DataObject data=new DataObject();
        r.put("data", data);
        data.put("email", email);
        data.put("password", password);
        DataObject ret=ds.fetch(r);
        //engine.close();
 
        DataList rdata=ret.getDataObject("response").getDataList("data");
        if(!rdata.isEmpty())
        {
            session.setAttribute("_USER_", rdata.get(0));
            response.sendRedirect("/");
            return;
        }
    }
%><!DOCTYPE html>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script type="text/javascript" src="/swbforms/js/eng.js" ></script>
    </head>
    <body>
        <script type="text/javascript">
            eng.initPlatform("/test/datasources.js");
        </script>  
        <h1>Login</h1>
        Forma
    </body>
</html>
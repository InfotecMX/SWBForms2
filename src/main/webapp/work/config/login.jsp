<%@page import="org.semanticwb.datamanager.*"%><%
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    System.out.println(email+" "+password);
    if(email!=null && password!=null)
    {
        SWBScriptEngine engine=DataMgr.initPlatform(session);
        SWBDataSource ds=engine.getDataSource("User");  
        DataObject r=new DataObject();
        DataObject data=new DataObject();
        r.put("data", data);
        data.put("email", email);
        data.put("password", password);
        DataObject ret=ds.fetch(r);
        //engine.close();
 
        DataList rdata=ret.getDataObject("response").getDataList("data");
        
        System.out.println("ret"+ret);
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
        <title>Login</title>
    </head>
    <body>
        <h1>Login</h1>
        <form action="/login" method="post">
          <div class="form-group has-feedback">
            <input type="email" name="email" class="form-control" placeholder="Email"/>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" name="password" class="form-control" placeholder="Password"/>
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-4">
              <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
            </div><!-- /.col -->
          </div>
        </form>
    </body>
</html>
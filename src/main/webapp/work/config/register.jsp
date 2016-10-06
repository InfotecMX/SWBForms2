<%-- 
    Document   : register
    Created on : 26-ago-2015, 17:54:48
    Author     : javiersolis
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.semanticwb.datamanager.*"%><%
    String fullname=request.getParameter("fullname");
    String email=request.getParameter("email");
    String password=request.getParameter("password");
    String password2=request.getParameter("password2");
    if(email!=null && password!=null)
    {
        if(password.equals(password2))
        {
            SWBScriptEngine engine=DataMgr.initPlatform(session);
            SWBDataSource ds=engine.getDataSource("User");   
            DataObject obj=new DataObject();
            obj.put("fullname", fullname);
            obj.put("email", email);
            obj.put("password", password);
            ds.addObj(obj);
            //engine.close();
            response.sendRedirect("/login");
            return;
        }
    }
%><!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">      
    <title>Register</title>
  </head>
  <body>
    <h1>Register</h1>      
    <form action="" method="post">
      <div class="form-group has-feedback">
        <input type="text" name="fullname" class="form-control" placeholder="Full name"/>
        <span class="glyphicon glyphicons-user form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="email" name="email" class="form-control" placeholder="Email"/>
        <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" name="password" class="form-control" placeholder="Password"/>
        <span class="glyphicon glyphicon-lock form-control-feedback"></span>
      </div>
      <div class="form-group has-feedback">
        <input type="password" name="password2" class="form-control" placeholder="Retype password"/>
        <span class="glyphicon glyphicon-log-in form-control-feedback"></span>
      </div>        
      <div class="row">
        <div class="col-xs-4">
          <button type="submit" class="btn btn-primary btn-block btn-flat">Register</button>
        </div><!-- /.col -->
      </div>
    </form>        
  </body>
</html>
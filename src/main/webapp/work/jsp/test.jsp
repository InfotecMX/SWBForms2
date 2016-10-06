<%-- 
    Document   : agenda
    Created on : 11-nov-2013, 16:03:28
    Author     : javier.solis.g
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script type="text/javascript" src="/swbforms/js/eng.js" ></script>
    </head>
    <body>
        <script type="text/javascript">
            eng.initPlatform("/test/datasources.js",false);
        </script>  
        
        <div>
            <h2 style="margin-right: 50px">Pais</h2>
            <script type="text/javascript">
                eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200, canEdit:true,canAdd:true,canRemove:true}, "Pais");
            </script>          
        </div>          
        
        <div>
            <h2 style="margin-right: 50px">Estado</h2>
            <script type="text/javascript">
                eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200,canEdit:true, canAdd:true,canRemove:true}, "Estado");
            </script>          
        </div>          
        
    </body>
</html>

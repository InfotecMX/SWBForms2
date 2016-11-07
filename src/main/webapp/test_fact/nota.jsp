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
            eng.initPlatform("datasources.js", false);
        </script>        
        <h2>Nota</h2>            
        <script type="text/javascript">
            var id = "<%=request.getParameter("id")%>";
            var form=eng.createForm({
                width: "100%",
                height: 600,
                title:"Información",
                showTabs: false,
            }, id, "Nota");
        </script>
    </body>
</html>

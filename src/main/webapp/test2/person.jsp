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
            eng.initPlatform("/test2/datasources.js", false);
        </script>        
        <h2>Person</h2>            
        <script type="text/javascript">
            var id = "<%=request.getParameter("id")%>";
            var form=eng.createForm({
                width: "100%",
                height: 600,
                title:"Información",
                showTabs: true,
                fields: [
                    {name: "name", width:"500", colSpan:3, rowSpan:2},
                    {name: "lastname"},
                    {name: "age"},
                    {name: "email", title: "Email"},
                    {name: "birddate"},
                    {name: "intitution"},
                    {name: "lastdegree"},
                    {name: "tecnocalprofile"},
                    {name: "profileSkils"},
                    {name: "cvs"},
                    {name: "status"},
                    {name: "addresses", hidden:false, fields: [
                            {name: "name"},
                            {name: "street"},
                            {name: "number"},
                            {name: "city"},
                            {name: "county"},
                            {name: "cp"},
                            //{name: "country"},
                            {name: "state"},
                        ], winEdit:{title:"Otro",
                            fields: [
                                {name: "name"},
                                {name: "street"},
                                {name: "number"},
                                {name: "city"},
                                {name: "county"},
                                {name: "cp"},
                                //{name: "country"},
                                //{name: "state"},
                            ]
                        } },
                    {name: "view", title:"Vista", stype:"gridView", fields: [
                            {name: "name", title:"Nombre", type:"string"},
                            {name: "number", title:"Número", type:"int"},
                        ], data:[{name:"Javier",number:34},{name:"Carlos",number:24}]
                    },
                ],
                links: [
                    {name: "address2", title:"Address", fields: [
                            {name: "name", colSpan:2, width:"100%"},
                            {name: "street"},
                            {name: "number"},
                            {name: "city"},
                            {name: "county"},
                            {name: "cp"},
                            {name: "country"},
                            {name: "state"},
                        ]},
                    {name: "test", disabled_:function(){return false;},
                        fields: [
                            {name: "email", title: "Email"},
                            {name: "addresses", title: "Direcciones", required: false, stype: "grid", dataSource: "Address"},
                            {name: "view", title:"Vista", stype:"gridView", fields: [
                                    {name: "name", title:"Nombre", type:"string"},
                                    {name: "number", title:"Número", type:"int"},
                                ], data:[{name:"Javier",number:34},{name:"Carlos",number:24}]
                            },
                        ]
                    }
                ]
            }, id, "Person");
        </script>
    </body>
</html>

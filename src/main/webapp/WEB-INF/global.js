//******* DataStores ***************

eng.config={
    baseDatasource:"/WEB-INF/global.js"
};

//******* DataStores ***************
eng.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.datamanager.datastore.DataStoreMongo",
};

//******* DataSorices ************
eng.dataSources["User"]={
    scls: "User",
    modelid: "Cloudino",
    dataStore: "mongodb",   
    fields:[
        {name:"fullname",title:"Nombre",type:"string"},
        //{name:"username",title:"Usuario",type:"string"},
        {name:"password",title:"Contraseña",type:"password"},
        {name:"email",title:"Correo electrónico",type:"string"},
    ],
};

/******* DataProcessors ************/
eng.dataProcessors["UserProcessor"]={
    dataSources: ["User"],
    actions:["fetch","add","update"],
    request: function(request, dataSource, action)
    {
        if(request.data.password)
        {
            request.data.password=this.encodeSHA(request.data.password);
        }
        return request;
    }          
};

eng.routes={
    loginFallback: "login",
    routeList:[
        { routePath: "login", forwardTo: "/work/config/login.jsp", isRestricted: "false" },
        { routePath: "register", forwardTo: "/work/config/register.jsp", isRestricted: "false" },
        { routePath: "", forwardTo: "/index.jsp", isRestricted: "false"},
        { routePath: "work", isRestricted: "true"},
        { routePath: "work/*", jspMapTo: "/work/jsp/", isRestricted: "true" },
        { routePath: "ds", forwardTo: "/swbforms/jsp/datasource.jsp", isRestricted: "false" },
    ],
};
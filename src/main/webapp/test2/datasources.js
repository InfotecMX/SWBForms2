eng.validators["email"] = {type: "regexp", expression: "^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$", errorMessage: "No es un correo electrónico válido"};


eng.dataSources["TecnicalProfile"] = {
    scls: "TecnicalProfile",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "description", title: "Descripción", required: false, type: "string"},
    ]
}

eng.dataSources["ProfileSkils"] = {
    scls: "ProfileSkils",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "description", title: "Descripción", required: false, type: "string"},
        {name: "tecnocalprofile", title: "Tecnical Profile", required: true, stype: "select", dataSource: "TecnicalProfile"},
        {name: "active", title: "Active", required: false, type: "boolean"},
        {name: "index", title: "Index", required: false, type: "boolean"},
    ]
}

eng.dataSources["Institution"] = {
    scls: "Institution",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "description", title: "Descripción", required: false, type: "string"},
    ]
}

eng.dataSources["LastDegree"] = {
    scls: "LastDegree",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "description", title: "Descripción", required: false, type: "string"},
    ]
}

eng.dataSources["Person"] = {
    scls: "Person",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "lastname", title: "Apellidos", required: true, type: "string", validators: [
//            {
//                type:"serverCustom",                                    //serverCustom del lado del servidor
//                serverCondition:function(name,value,request){  
//                    print("Valor:"+request.data.name);
//                    return value=="Solis2";
//                },
//                errorMessage:"Error desde el servidor, el valor debe de ser Solis2"
//            }
            ]},
        {name: "age", title: "Edad", required: true, type: "int", validators: [{type: "integerRange", min: 1, max: 20}]},
        {name: "email", title: "Correo Electrónico", required: true, type: "string", validators: [{stype: "email"},{type:"isUnique"}]},
        {name: "birddate", title: "Fecha Nacimiento", required: true, type: "date"},
        {name: "intitution", title: "Dependecia", required: true, stype: "select", dataSource: "Institution"},
        {name: "lastdegree", title: "Ultimo grado", required: true, stype: "select", dataSource: "LastDegree"},
        {name: "tecnocalprofile", title: "Perfil Técnico", required: true, stype: "select", dataSource: "TecnicalProfile", dependentSelect: "profileSkils"},
        {name: "profileSkils", title: "Habilidades", required: true, multiple: true, stype: "select", dataSource: "ProfileSkils"},
        {name: "cvs", title: "Curriculúm", required: false, multiple: true, stype: "file"},
        {name: "status", title: "Activo", required: false, type: "boolean"},
        {name: "addresses", title: "Direcciones", required: false, stype: "grid", dataSource: "Address"},
    ],
    links: [
        {name: "address2", title: "Dirección", stype: "subForm", dataSource: "Address"},
        {name: "test", title: "Test", stype: "tab"}
    ]
};


eng.dataSources["Address"] = {
    scls: "Address",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name: "street", title: "Calle", required: true, type: "string"},
        {name: "number", title: "Numero", type: "string"},
        {name: "city", title: "Colonia", type: "string"},
        {name: "county", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_: [{stype: "zipcode"}]},
        {name: "country", title: "Pais", required: true, stype: "select", dataSource: "Country", dependentSelect: "state", dependentSelect_: {filterProp: "pais", dependentField: "estado"}},
        {name: "state", title: "Estado", required: true, stype: "select", dataSource: "State", canFilter: false, initialCriteria_: {}},
    ]
};

eng.dataSources["Country"] = {
    scls: "Country",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Pais", required: true, type: "string"},
        {name: "cid", title: "Clave", required: true, type: "string"},
    ]
};

eng.dataSources["State"] = {
    scls: "State",
    modelid: "SiteResources",
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Estado", required: true, type: "string"},
        {name: "country", title: "Pais", required: true, stype: "select", dataSource: "Country"},
    ]
};



//dataProcessor
eng.dataProcessors["PersonProcessor"] = {
    dataSources: ["Person"],
    actions: ["add", "update"],
    request: function(request, dataSource, action)
    {
        print("action:" + action);
        //if(request.data.name)request.data.name=request.data.name+"_jei";
        print("request1:" + request);
        return request;
    },
//    response: function(response, dataSource, action)
//    {
//        print("action:"+action);
//        print("response:"+response);
//        return response;
//    }
};

//dataService
eng.dataServices["PersonService"] = {
    dataSources: ["Person"],
    actions: ["add", "remove", "update"],
    service: function(request, response, dataSource, action)
    {
        print("user:" + this.user);
        //print("All:"+this.getDataSource("Person").fetch({data:{name:"Javier"}}));
    }
};
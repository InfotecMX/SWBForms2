
eng.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators:[{type:"integerRange", min:5, max:5000}], validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", displayFormat_:"value+'_Hola'", dependentSelect:"estado", dependentSelect_: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, initialCriteria_ : {} },
    ]
};

eng.dataSources["Pais"] = {
    scls: "Pais",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Pais", required: true, type: "string"},
        {name: "abre", title: "Clave", required: true, type: "string"},
        {name: "ext", title: "Ext", required: false, type: "string"},
    ]
};

eng.dataSources["Estado"] = {
    scls: "Estado",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Estado", required: true, type: "string"},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais"},
        {name: "bandera", title: "Bandera", required: false, stype: "file"},
    ]
};

/*
//dataService
eng.dataServices["EstadoService"] = {
    dataSources: ["Estado"],
    actions: ["add"],
    service: function(request, response, dataSource, action)
    {
        print("request:" + request);
        response.data.jei=["Hola","Mundo"];
        this.getDataSource(dataSource).updateObj(response.data);
    }
};
*/

//dataProcessor
eng.dataProcessors["EstadoProcessor"] = {
    dataSources: ["Estado"],
    actions: ["add",],
    request: function(request, dataSource, action)
    {
        //print("action:" + action);
        //request.data.jei=["Hola","Mundo"];
        //print("request:" + request);        
        return request;
    },
    response: function(response, dataSource, action)
    {
        print("response:" + response);
        //response.data.jei=["Hola","Mundo"];        
        var obj=this.getDataSource(dataSource).fetchObjById(response.response.data._id);
        obj.jei=["Hola","Mundo"];
        this.getDataSource(dataSource).updateObj(obj);
        
        
        print(this.getDataSource(dataSource).fetch({data:{nombre:"jj"}}));
        
        print("obj:" + obj);   
        
        return response;
    },
};

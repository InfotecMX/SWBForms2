//******* DataStores ***************
eng.dataStores["ts_leveldb"]={
    path:"/data/leveldb",
    class: "org.semanticwb.datamanager.datastore.SemDataStore",
    
};

eng.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "SWBF2",
    dataStore: "ts_leveldb",    
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", dependentSelect:"estado", dependentSelect_: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, initialCriteria_ : {} },
    ]
};

eng.dataSources["Pais"] = {
    scls: "Pais",
    modelid: "SWBF2",
    dataStore: "ts_leveldb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Pais", required: true, type: "string"},
        {name: "abre", title: "Clave", required: true, type: "string"},
    ]
};

eng.dataSources["Estado"] = {
    scls: "Estado",
    modelid: "SWBF2",
    dataStore: "ts_leveldb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Estado", required: true, type: "string"},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais"},
    ]
};


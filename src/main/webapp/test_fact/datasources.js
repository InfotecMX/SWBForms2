
eng.dataSources["Nota"] = {
    scls: "Nota",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "folio",
    fields: [
        {name: "folio", title: "Folio", required: true, type: "string"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "productos", title: "Productos", stype: "grid", removeDependence_:true, dataSource:"DetalleProducto"},
        {name: "total", title: "Total", type: "float"},        
    ],
    links:[
        {name: "cliente", title: "Cliente", stype: "subForm", removeDependence_:true, dataSource:"Cliente"}
    ]
};

eng.dataSources["DetalleProducto"] = {
    scls: "DetalleProducto",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "producto",
    fields: [
        {name: "producto", title: "Producto", stype: "select", dataSource:"Producto"},
        {name: "descripcion", title: "Descripcion", type: "text"},
        {name: "cantidad", title: "Cantidad", type: "float"},
        {name: "precio", title: "Precio", type: "float"},
    ]
};

eng.dataSources["Cliente"] = {
    scls: "Cliente",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "Direccion", title: "Direccion", type: "text"},
        {name: "telefono", title: "telefono", type: "string"},
    ]
};


eng.dataSources["Producto"] = {
    scls: "Producto",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "nombre",
    fields: [
        {name: "nombre", title: "Nombre", required: true, type: "string"},
        {name: "descripcion", title: "Descripcion", type: "text"},
        {name: "precio", title: "Precio", type: "float"},
    ]
};

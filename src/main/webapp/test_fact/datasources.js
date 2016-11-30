
eng.dataSources["Nota"] = {
    scls: "Nota",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "folio",
    fields: [
        {name: "folio", title: "Folio", required: true, canEdit:true, type: "string"},
        {name: "fecha", title: "Fecha", type: "date", useTextField:true},
        {name: "cliente", title: "Cliente", stype: "select", dataSource:"Cliente"},
        {name: "cliente2", title: "Cliente2", stype: "select", dataSource:"Cliente"},
        {name: "productos", title: "Productos", stype: "grid", showGridSummary:true, listEndEditAction: "next", removeDependence_:true, dataSource:"DetalleProducto"},
        {name: "total", title: "Total", canEdit:false, format:"$,##0.00", type: "float"},        
    ],
};

eng.dataSources["DetalleProducto"] = {
    scls: "DetalleProducto",
    modelid: "SWBF2",
    dataStore: "mongodb",    
    displayField: "producto",
    fields: [
        {name: "producto", title: "Producto", stype: "select", dataSource:"Producto", changed:function(form,item,value){
                //console.log(form,item,value);
                var record=item.getSelectedRecord(); 
                //console.log(record); 
                if(record) 
                {
                    form.setValue('precio', record.precio);
                    form.setValue('cantidad', 1);
                    form.setValue('descripcion', record.descripcion);
                    form.focusInItem("cantidad");
                }
            }
        },
        {name: "descripcion", title: "Descripcion", type: "text"},
        {name: "cantidad", title: "Cantidad", type: "float", validateOnExit:true},
        {name: "precio", title: "Precio", format:"$,##0.00", type: "float", showGridSummary:false},
        {name:"subtotal", title:"Subtotal", type:"float", canEdit:false, readOnlyDisplay:"static", format:"$,##0.00", formula: { text: "precio*cantidad" } },
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

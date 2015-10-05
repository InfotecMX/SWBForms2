/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//Header
//Scripts de para importar la libreria
/*
        <script src="/engorms/js/eng.js" type="text/javascript"></script>
        <script type="text/javascript">
            eng.initPlatform("/test/datasources.js");
        </script> 
*/


//Tipos de propiedades o Fields
type: string, int, date, float, double, long            //primitivos
stype: grid, gridSelect, select, time, file             //extendidos

//Tipos de links, objetos vinculados a formas
stype: subForm, tab

//data stores
eng.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.forms.datastore.DataStoreMongo",
};

//Definir un datasource
eng.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    dataStore: "mongodb",      
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string"},
        {name: "cp", title: "CP", required: true, type: "int"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", winEdit:false}
    ],
    links: [
        {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ]               

};

//Crear un grid
eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Personal");

eng.createGrid(
{
    left:"-10", margin:"10px", width: "100%", height: 200,

    fields:[{name:"nombre"}],

    recordDoubleClick: function(grid, record)
    {
        window.location = "detail.jsp?dsName=ReportesVIN&_id=" + record._id;
        return false;
    },
    addButtonClick: function(event)
    {
        window.location = "detail.jsp?dsName=ReportesVIN";
        return false;
    },
    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},

    autoFetchTextMatchStyle:"exact",                    
}, "ReportesVIN");

//Crear una Forma
eng.createForm({title:"Forma", width: "99%", height:"70%"}, id, dataSource);                

eng.createForm({title:"Forma", width: "99%", height:"70%", fields:[{name:"nombre"}]}, id, dataSource);                

eng.createForm({title:"Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


eng.createForm({title: "Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp", validators:[{type:"integerRange", min:5, max:15}]},
                //{name: "estado"},
            ]}
    ],
    links: [
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


eng.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]
                    
},id, dataSource);

eng.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit: {title:"Hola", //propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                {name: "estado"},
            ]}, 
            fields: [                       //propiedades del grid
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]                    
},id, dataSource);



eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
eng.validators["zipcode"] = {type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"El codigo postal debe tener el formato ##### o #####-####."};

/*
validators:[{type:"integerRange", min:1, max:20}]
validators:[{type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
validators:[{type:"mask", mask:"^\\s*(1?)\\s*\\(?\\s*(\\d{3})\\s*\\)?\\s*-?\\s*(\\d{3})\\s*-?\\s*(\\d{4})\\s*$",transformTo:"$1($2) $3 - $4"}]
validators:[{type:"matchesField", otherField:"password", errorMessage:"Passwords do not match"}]
validators:[{type:"custom", condition:"return value == true", errorMessage:"You must accept the terms of use to continue"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
*/



//*************************************** server ************************//

//dataService
eng.dataServices["PaisService"] = {
    dataSources: ["Pais"],
    actions:["add","remove","update"],
    service: function(request, response, dataSource, action)
    {
        //print("request:"+request);
        //print("response:"+response);
        print("user:"+this.user);
        print("name:"+this.getDataSource("Pais").fetchObjById("_suri:VINDB:Pais:53ca73153004aec988f550e2").nombre);
        //print(this.getDataSource("Pais").fetch("{data:{abre : 'MX'}}"));
        //print(this.getDataSource("Pais").fetch());
        //print(this.getDataSource("Pais").fetch().response.data[0].nombre);
    }
};

//dataProcessor
eng.dataProcessors["PaisProcessor"] = {
    dataSources: ["Pais"],
    actions:["add","update"],
    request: function(request, dataSource, action)
    {
        print("action:"+action);
        print("request1:"+request);
        //print("user:"+this.getUser());
        //request.data.created=new java.util.Date();
        if(request.data.nombre)
        {
            request.data.habitantes=request.data.nombre.length()*1000+request.data.habitantes;
        }else if(request.oldValues.nombre)
        {
            request.data.habitantes=request.oldValues.nombre.length()*1000+request.data.habitantes;
        }
            
        print("request2:"+request);
        return request;
    },
    response: function(response, dataSource, action)
    {
        print("response:"+response);
        //print("user:"+this.getUser());
        print(response.response.data.created);
        return response;
    }
};


//serverCustom validators
eng.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    displayField: "titulo",
    dataStore: "mongodb",      
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string", validators: [{type:"isUnique"}]},  //validacion de unicidad del lado del servidor
        {name: "area", title: "Area", required: true, type: "string",validators: [
            {
                type:"serverCustom",                                    //serverCustom del lado del servidor
                serverCondition:function(name,value,request){                    
                    return value=="jei";
                },
                errorMessage:"Error desde el servidor, el valor debe de ser jei"
            }
        ]},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", width_:300, selectWidth:300, displayFormat: "value+' ('+record.lugarNacimiento+')'",
            displayFormat_:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
            }, 
            canFilter:false, selectFields:[{name:"nombre"},{name:"lugarNacimiento"}], showFilter:true, dataSource:"Personal"},
        {name: "revisor", title: "Revisor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", width_:"90%", winEdit:{title:"Dirección"}},
    ],
    links: [
        {name: "direccion1", title:"Dirección 1", stype:"tab", dataSource:"Direccion"},
        {name: "direccion2", title:"Dirección 2", stype:"subForm", dataSource:"Direccion"},
    ]
}; 

//*****************************************************************//
//dependentSelect 

//dependentSelect:"estado"
// o
//dependentSelect: {filterProp:"pais", dependentField:"estado"}

eng.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "VINDB",
    dataStore: "mongodb",      
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


//*****************************************************************//
//default values

eng.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area", canEdit:true},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit_: {title:"Hola",        //Propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode", errorMessage:"hola error..."}]},
                {name: "pais"},
                {name: "estado"}
            ],
            values:{calle:"calle3"},                        //valores de la ventana
        }, winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ],
            values:[{calle:"calle1"},{calle:"calle2"}],     //valores de la propiedad, grid
        }
    ],

    values:{                                                //valores de la forma
        titulo:"Titulo por defecto",                        
    },

    links: [
        {name: "direccion1"},
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ],
            values:{                                        //valores de objeto ligados
                calle:"Benito Juarez",
            }
        }
    ],


},null, "DataSourceName");


//*****************************************************************//
//initialCriteria
eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200, initialCriteria:{abre:"MX"},}, "Pais");



//Botones

form.submitButton.setTitle("Enviar");


    form.submitButton.setTitle("Siguiente");
    form.submitButton.click = function(p1)
    {
        eng.submit(p1.target.form, this, function()
        {
            window.location = "?p=<%=(p+1)%>&id=" + form.getData()._id;    
        });
        //window.location = "/es/imicam/resultados?&id=<%=id%>";
        //return false;
    };
    
    form.buttons.addMember(isc.IButton.create(
            {
                title: "Resultados",
                padding: "10px",
                click: function(p1) {
                    window.location = "/es/imicam/resultados?id=<%=id%>";
                    return false;
                }
            }));


//Secciones en formas
[
{defaultValue:"1. MERCADOTECNIA", disabled:false, type:"section", sectionExpanded:true, itemIds: ["1","1_1", "1_2", "1_3", "1_4", "1_5","1_6"] },
{name: "1", defaultValue:"1.1 Modernizacion del punto de venta: (1:Mal / Nunca,  2:Regular / Algunas Veces,  3:Bien / Casi Siempre,  4:Muy Bien / Siempre)", type:"Header"},
]



//******************************
//STYPES
//
//Select
[
    {name: "autor", title: "Autor", stype: "select", dataSource:"Personal",
        multiple:true, 
        canFilter:true,
        //Formato en linea 
        displayFormat:"value+' ('+record.lugarNacimiento+')'",
        //Formato como funcion 
        displayFormat:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
        },
        //Tamaño del select una vez desplegado
        selectWidth:250,
        //Campos a mostrar en el despliegue del select (en forma de grid dentro del combo)
        selectFields: [
              { name:"itemName", width:125 },
              { name:"units" },
              { name:"unitCost" }
        ],
        initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},
        //Dependencia de Seleccion
        dependentSelect:"estado",                                       //nombre de propiedad a filtrar si solo hay una propiedad dentro de estado de tipo pais
        // o
        dependentSelect: {filterProp:"pais", dependentField:"estado"}   //si ha mas de una propiedad dentro de estado de tipo pais se define cual es con filterProp
        //formatEditorValue:
    }
]
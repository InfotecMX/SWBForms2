var isomorphicDir = "/isomorphic/";

var eng = {
    operationBindings: [
        {operationType: "fetch", dataProtocol: "postMessage"},
        {operationType: "add", dataProtocol: "postMessage"},
        {operationType: "update", dataProtocol: "postMessage"},
        {operationType: "remove", dataProtocol: "postMessage"},
        {operationType: "validate", dataProtocol: "postMessage"},
    ],
    dataStores:{},                      //DataStores
    dataSources: {},                    //Datasources
    fieldProcesors:{},                  //Procesadores de field elements
    validators:{},                      //Validator templates
    dataServices:{},                    //Servicios
    dataProcessors:{},                  //DataProcessors
    authModules:{},                     //Modulos de autenticación    
    userRepository:{},                  //User Repository
    
    dsCounter:0,                        //contador incremental para IDs de datasources 
    
    dataSourceScriptPath:"",            //ruta de datasource.js
    
    dataSourceServlet:"/ds",
    
    //Metodos Internos
    
    //Construccion de un array
    array:function(arr)
    {
        var ret=[];
//        if(arr)ret=arr;
        if(Array.isArray(arr))ret=arr;
        else if(arr)
        {
            ret.push(arr);
        }        
        ret.remove=function(obj)
        {
            while ((ax = ret.indexOf(obj)) !== -1) {
                ret.splice(ax, 1);
            }            
        };
        return ret;
    },
            
    //Timer para inhabilitar boton de submit
    startSubmitTimeOut:function(button)
    {
        if(eng.submitTimeOut)clearTimeout(eng.submitTimeOut);        
        if(button && button!=null)
        {
            eng.submitButton=button;  
            eng.submitButton.disable();
            eng.submitTimeout=setTimeout(function(){
                eng.stopSubmitTimeOut()
            },3000);
        }        
    },
            
    //activar boton de submit y detener timer            
    stopSubmitTimeOut:function()
    {
        if(eng.submitTimeOut)clearTimeout(eng.submitTimeOut);
        if(eng.submitButton)eng.submitButton.enable();
    },    
    
    linkFormGrid:function(form, grid)  //Metodo Interno
    {
        if(!form.formGrids)
        {
            form.formGrids=[];
        }
        form.formGrids.push(grid);
        grid.form=form;
    },    
            
    linkForm:function(fromForm, toForm, prop)  //Metodo Interno
    {
        if(!fromForm.linkToForms)
        {
            fromForm.linkToForms=[];
        }
        if(!toForm.linkFromForms)
        {
            toForm.linkFromForms=[];
        }        
        fromForm.linkToForms.push({
            form:toForm, 
            prop:prop
        });
        toForm.linkFromForms.push({
            form:fromForm, 
            prop:prop
        });
    },    
            
    getSubmitList:function(form, arr)
    {
        arr.push(form);
        if(form.formGrids)
        {
            for (var i = form.formGrids.length; i--;) 
            {
                var grid=form.formGrids[i];   
                arr.push(grid);
            }
        }
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                eng.getSubmitList(to.form,arr);
            }
        }        
    },            
    
    submitForm:function(form,callback)
    {
        //console.log("submitForm:"+form.ID);
        var arr=[];
        eng.getSubmitList(form,arr);
        eng.submitList(arr,callback);
    },
            
    submitList:function(arr,callback,index)
    {
        //console.log("submitList:"+arr+" "+index);
        if(!index && index!=0)index=arr.length-1;
        if(index>=0)
        {
            var form=arr[index];
            if(form.getAllEditRows)
            {
                eng.submitListGrid(form,arr,callback,index);    
            }else
            {
                eng.submitListForm(form,arr,callback,index);
            }        
        }else if(index==-1)
        {
            eng.stopSubmitTimeOut()
            if(callback && callback!=null)callback();
            else
            {
                isc.say("Datos enviados correctamente...");
            }
        }
    },
            
    submitListGrid:function(grid,farr,callback,findex)
    {
        //console.log("submitListGrid:"+grid.ID+" "+findex);
        if(grid!=null)
        {
            var earr=grid.getAllEditRows();
            //grid.clearCriteria()
            //grid.invalidateCache();
            //var fin=null;
            //if(earr.length>0)fin=earr[earr.length-1];
            if(earr.length>0)
            {
                //Valida renglones en blanco
//                if(Object.keys(grid.getEditValues(earr[0])).length==0)
//                {
//                    grid.discardEdits(earr[0]);
//                    eng.submitListGrid(grid,farr,callback,findex);
//                }else
//                {
                    eng.startSubmitTimeOut();
                    
                    var ds=eng.getDataSource(grid.getDataSource().dsName);
                    var val=eng.array(grid.canvasItem.getValue());
                        
                    for (var i = earr.length; i--;) 
                    {
                        var recid=earr[i];
                        var data=grid.getEditValues(recid);
                        
                        if(Object.keys(grid.getEditValues(earr[0])).length>0)
                        {
                            //eliminar record
                            if(grid.recordMarkedAsRemoved(recid))
                            {
                                ds.removeObj({_id:data._id});
                                val.remove(data._id);
                            }else if(grid.isNewEditRecord(recid))
                            {
                                var r=ds.addObj(data);
                                if(r.status==0)
                                {
                                    grid.setEditValues(recid,r.data);
                                    val.push(r.data._id);
                                }else
                                {
                                    alert(r.error);
                                }
                            }else
                            {
                                var r=ds.updateObj(data);
                                if(r.status==0)
                                {
                                    grid.setEditValues(recid,data);
                                }else
                                {
                                    alert(r.error);
                                }
                            }
                        }
                    }        
                    
                    grid.invalidate=true;
                    if(val.length>0)
                        grid.form.saveItemValue(grid.canvasItem,val);
                    else
                        grid.form.saveItemValue(grid.canvasItem,null);
                    
                    eng.submitList(farr,callback,--findex); 
                    
                    grid.canvasItem.showValue(val,val);
                    
                    /*
                    grid.recordMarkedAsRemoved(earr[0])
                    grid.isNewEditRecord(earr[0])

                    grid.saveEdits(null,function(rowNum, colNum, editCompletionEvent, success)
                    {                                 
                        //console.log("grid.saveEdits:"+grid.ID+" "+rowNum);                    
                        //if(fin==rowNum)
                        if(grid.getAllEditRows().length==0)
                        {
                            var arr=[];
                            for(var j=0;j<grid.getTotalRows();j++)
                            {
                                var rec=grid.getRecord(j);
                                if(rec!=null)
                                {
                                    var suri=rec._id;
                                    if(suri && suri!=null)arr.push(suri);
                                }
                            }                                                

                            if(grid.canvasItem)
                            {
                                //alert(this.canvasItem.getValue());
                                if(arr.length>0)
                                    grid.form.saveItemValue(grid.canvasItem,arr);
                                else
                                    grid.form.saveItemValue(grid.canvasItem,null);
                            //alert(arr +" "+this.canvasItem.getValue());                        
                            }else
                            {
                                if(arr.length>0)
                                    grid.form.setValue(grid.parentElement.prop,arr);
                                else
                                    grid.form.setValue(grid.parentElement.prop,null);
                            }
                            eng.submitList(farr,callback,--findex);                        
                        }else
                        {
                            eng.submitListGrid(grid,farr,callback,findex);
                        }
                    },earr[0]);
                    */
//                }
            }else
            {
                eng.submitList(farr,callback,--findex); 
            }
            
            
        }else
        {
            eng.submitList(farr,callback,--findex);
        }
    },         
    
            
    submitListForm:function(form, farr, callback, findex)
    {
        //console.log("submitListForm:"+form.ID+" "+farr+" "+findex);
        //alert(form);
        
        //console.log("submitInv:"+form);
        eng.startSubmitTimeOut();
        form.saveData(function()
        {
            //console.log("form.saveData:"+form.ID);
            form.rememberValues();
            if(form.linkFromForms)
            {
                for (var i = form.linkFromForms.length; i--;) 
                {
                    var from=form.linkFromForms[i];  
                    from.form.setValue(from.prop,form.getValue("_id"));
                }
            }
            
            //revisar si la forma esta vinculada a un grid
            if(form.fromGrid!=null)
            {     
                //alert(form.fromGrid+" "+form.getValue("_id"));
                var grid=form.fromGrid;
                var arr=[];
                var rec=null;
                var add=true;
                var fsuri=form.getValue("_id");
                var _suri=form.getValue("_suri");
                for(var j=0;j<grid.getTotalRows();j++)
                {
                    rec=grid.getRecord(j);
                    if(rec!=null)
                    {
                        var suri=rec._id;
                        if(suri && suri!=null && suri!=_suri)
                        {
                            arr.push(suri);
                            if(fsuri==suri)add=false;
                        }
                    }
                }
                if(add)arr.push(fsuri);
                
                //alert(grid.canvasItem.form);
                grid.invalidate=true;
                
                if(grid.canvasItem)
                {
                    if(arr.length>0){
                        grid.canvasItem.form.saveItemValue(grid.canvasItem,arr);
                        grid.canvasItem.showValue(null,arr);
                    }
                    else{
                        grid.canvasItem.form.saveItemValue(grid.canvasItem,null);
                        grid.canvasItem.showValue(null,null);                
                    }
                }else
                {
                    if(arr.length>0)
                    {
                        grid.form.setValue(grid.prop,arr);
                    }
                    else 
                    {
                        grid.form.setValue(grid.prop,null);
                    }
                    //Actualiza grid
                    grid.canvasItem.showValue(null,grid.form.getValue(grid.prop));
                }
                
            eng.submitForm(grid.canvasItem.form);
            //eng.submitFormInv(grid.canvasItem.form);
            //alert("revisar forma fomas vinculadas a grid parent");                
            }
            //Si la forma esta en una ventama y es la ventana a la que se le dio save cierra la ventana
            if(form.window && eng.submited==form)
            {
                form.window.closeClick();
            }
            
            eng.submitList(farr,callback,--findex);
        });
    },                 
            
    //Valida la forma dada            
    validateForm:function(form)
    {
        //console.log("validateForm:"+form.ID);
        //form.synchronousValidation=true;
        form.handleAsyncValidationReply=function(s,e)
        {
            if(s==false)
            {
                eng.validates.isValid=false;
                var err=form.getErrors();
                err.form=form;
                eng.validates.errors.push(err);
            //form.showErrors();
            //eng.desc(form.getErrors(),true);
            }
            eng.validates.remove(form);
        };
        var ret=form.validate();
        if(form.isPendingAsyncValidation()==true)
        {
            eng.validates.push(form);
        }
        //ret=form.hasErrors();
        
        if(ret==false)
        {
            eng.validates.isValid=false;
            var err=form.getErrors();
            err.form=form;
            eng.validates.errors.push(err);
            return false;
        }
                
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                if(eng.validateForm(to.form)==false)return false;
            }
        }   
        
        if(form.formGrids)
        {
            for (var i = form.formGrids.length; i--;) 
            {
                var grid=form.formGrids[i];
                if(grid.canvasItem.validate()==false)return false;
            }                          
        }
        return true;        
    },    
            
    //Filtra y combina los objetos json, por ejemplo links definidos en el datasource, 
    //con los definidos en la forma         
    mergeAndArray:function(bnodes, fnodes)
    {
        if(!fnodes)return bnodes;
        var ret=[];
        for(var x=0;x<fnodes.length;x++)
        {
            for(var y=0;y<bnodes.length;y++)
            {
                if(bnodes[y].name===fnodes[x].name)
                {
                    ret.push(eng.utils.clonAndMergeObjects(bnodes[y],fnodes[x]));
                }
            }
        }        
        return ret;
    },     
            
    //Agregar un link a una forma         
    addLinks:function(links,tabs,tab,pane,form)
    {
        links=eng.mergeAndArray(links,form.links);
        
        if(links)
        {
            for (var x=0;x<links.length;x++) 
            {
                var link=links[x];
                
                var ds = eng.createDataSource(link.dataSource,true,link);       
                                
                if(link.stype==="subForm")
                {
                    
                    var sform=isc.DynamicForm.create({
                        numCols: "6",
                        cellPadding: 5,
                        titleAlign : "right",
                        disabled : false,
                        dataSource: ds,
                        fields:link.fields,
                        values:link.values,
                        canEdit:form.canEdit,
                    });
                    sform.tindex=form.tindex;

                    var spane=isc.VStack.create({
                        membersMargin: 10,
                        //styleName: 'normal seccion',
                        //class: 'normal seccion',
                        members : [
                            isc.Label.create({
                                contents: link.title,
                                width: "100%",
                                height: 25,
                                autoDraw: true,
                                baseStyle: "exampleSeparator"
                            }),
                            sform
                        ]
                    });              
                    pane.addMember(spane);
                    
                    eng.linkForm(form,sform,link.name);
                    
                    eng.addLinks(ds.links,tabs,tab,spane,sform);
                }else if(link.stype==="tab")
                {
                    var sform=isc.DynamicForm.create({
                        numCols: "6",
                        cellPadding: 5,
                        titleAlign : "right",
                        disabled : false,
                        dataSource: ds,
                        fields:link.fields
                    });
                    
                    sform.tindex=form.tindex+1;
                    
                    var spane=isc.VStack.create({
                        members: [sform]
                    });

                    var stab={
                        title: link.title,
                        pane: spane
                    };
                    
                    tabs.addTab(stab);
                    eng.linkForm(form,sform,link.name);
                    eng.addLinks(ds.links,tabs,stab,spane,sform);
                }
            }                  
        }        
     
    },    
            
    //Muestra los errores de validacion        
    showFormErrors:function()
    {
        eng.stopSubmitTimeOut();
        var txt="";
        var ferr=null;
        for (var i = eng.validates.errors.length; i--;) 
        {
            var obj=eng.validates.errors[i];
            for (property in obj) 
            {
                var field=isc.DS.get(obj.form.dataSource).fields[property];
                if(field)
                {
                    txt+=field.title+": "+obj[property]+"</br>";
                    ferr=obj.form;
                }
            }            
        }
        //eng.desc(eng.validates.errors[0],true);        
        isc.warn(txt);
        if(ferr!=null)
        {
            var tabs=eng.findObject(eng.submited.dataSource.dsName+"Tabs");
            if(tabs){
                if(typeof ferr.tindex === 'undefined') //es Un grid
                {
                    tabs.selectTab(ferr.parentElement.tindex);
                }else // es una forma
                {
                    tabs.selectTab(ferr.tindex);
                }
            }
        }
    },               
                        
    //Busca un objeto por ID            
    findObject: function(id)
    {
        var obj = null;
        try
        {
            obj = eval(id);
        } catch (e) {
        }
        return obj;
    },
    
    //Abre un url en el target especificado
    openURL: function(url, target)
    {
        var win = window.open(url, target);
        win.focus();
    },
    
    //realiza un submit a una forma dada
    submit: function(form, button, callback)
    {
        eng.startSubmitTimeOut(button);        
        //console.log("submit:"+form.ID);
        eng.submited=form;             //Forma original enviada
        
        eng.validates=eng.array();    //Array para server validates
        eng.validates.isValid=true;
        eng.validates.errors=[];
        
        if(eng.validateForm(form)==true && eng.validates.isValid==true)
        {
            if(eng.validates.length==0)    //Si no hay validaciones del server pendientes envia el submit
            {
                eng.submitForm(form,callback);
            }else
            {
                var inter=window.setInterval(function()
                {
                    var end=true;
                    for (var i = eng.validates.length; i--;) 
                    {
                        var frm=eng.validates[i];  
                        if(frm.isPendingAsyncValidation()==true)end=false;
                    }
                    if(end==true)
                    {
                        window.clearInterval(inter);
                        //alert("end:"+eng.validates.isValid);
                        if(eng.validates.isValid==true)
                        {
                            eng.submitForm(form,callback);
                        }else
                        {
                            eng.showFormErrors();
                        } 
                    }                
                },100);
            }
                
        }else
        {
            eng.showFormErrors();
        }
    },
    
    //Realiza un fetch de una forma con los datos especificados            
    editFormFromGrid:function(form, grid)
    {    
        form.editSelectedData(grid);
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];

                val=form.getValue(to.prop);
                if(val)eng.fetchForm(to.form,{
                    _id:val
                });
            }               
        }
    },
            
    //Realiza un fetch de una forma con los datos especificados            
    fetchForm:function(form, data)
    {
        form.fetchData(data,function()
        {
            if(form.formGrids)
            {
                for (var i = form.formGrids.length; i--;) 
                {
                    var grid=form.formGrids[i];

                    if(grid.prop)
                    {
                        var val=form.getValue(grid.prop);
                        grid.canvasItem.showValue(null,val);
                    }
                }               
            }
            
            if(form.linkToForms)
            {
                for (var i = form.linkToForms.length; i--;) 
                {
                    var to=form.linkToForms[i];

                    val=form.getValue(to.prop);
                    if(val)eng.fetchForm(to.form,{
                        _id:val
                    });
                }               
            }
        });
    },
            
    //resize form         
    resize:function(form)
    {
        for (var i = form.items.length;i--;)
        {
            form.items[i].setWidth(form.items[i].getWidth());            
        }
        
        if(form.linkToForms)
        {
            for (var i = form.linkToForms.length; i--;) 
            {
                var to=form.linkToForms[i];   
                eng.resize(to.form);
            }
        }           
//        if(form.formGrids)
//        {
//            for (var i = form.formGrids.length; i--;) 
//            {
//                var grid=form.formGrids[i];
//            }                          
//        }
        return true;        
    },                
            
            
    //Regresa un objeto con el nombre y ID del Datasource en base al parametro dado que puede ser 
    //un string o un objeto con los dos parametros        
    getDataSourceObjDef: function(dsDef, clone)
    { 
        var dsObjDef={};
        if(dsDef)
        {
            if(typeof dsDef == 'string')
            {  
                dsObjDef.dsName=dsDef;
                dsObjDef.dsId="ds_"+dsDef;
                if(clone===true)dsObjDef.dsId+="_"+(eng.dsCounter++);
            }
            else if(dsDef.fields)
            {
                dsObjDef.ds=dsDef;
            }else if(dsDef.ds)
            {
                dsObjDef.ds=dsDef.ds;
            }else 
            {
                if(dsDef.dsName)dsObjDef.dsName=dsDef.dsName;
                if(dsDef.dsId)dsObjDef.dsId=dsDef.dsId;
                else 
                {
                    dsObjDef.dsId="ds_"+dsDef.dsName;
                    if(clone===true)dsObjDef.dsId+="_"+(eng.dsCounter++);
                }
            }
        }
        return dsObjDef;
    },
            
    createDataSource: function(dsDef,clone,formDef)
    {
        var dsObjDef=eng.getDataSourceObjDef(dsDef,clone);
        
        var ds=(dsObjDef.ds)?dsObjDef.ds:eng.findObject(dsObjDef.dsId);
            
        if (ds == null)
        {
            var data = eng.utils.cloneObject(eng.dataSources[dsObjDef.dsName]);
            if(data)
            {
                data.ID = dsObjDef.dsId;
                data.dsName = dsObjDef.dsName;
                data.dataFormat = "json";
                data.dataURL = eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath+"&ds="+dsObjDef.dsName;// + "&scls=" + data.scls;//+"&modelid=" + data.modelid;
                data.operationBindings = eng.operationBindings;
                
                if(formDef && formDef.fields)
                {
                    data.fields=eng.mergeAndArray(data.fields,formDef.fields);
                }

                eng.processFields(data.fields);
                data.fields.unshift({name: "_id", type: "string", hidden: true, primaryKey: true});    //Insertar llave primaria
                return isc.RestDataSource.create(data);
            }
        }
        return ds;
    },
            
            
    createGrid: function(base, dsDef)
    {
        //eng.initPlatform();     
        
        var ds = eng.createDataSource(dsDef);
        
        if (base.alternateRecordStyles===undefined)
            base.alternateRecordStyles = true;
        if (base.emptyCellValue===undefined)
            base.emptyCellValue = "--";
        if (base.dataPageSize===undefined)
            base.dataPageSize = 20;
        if (base.dataSource===undefined)
            base.dataSource = ds;
        if (base.autoFetchData===undefined)
            base.autoFetchData = true;
        if (base.position===undefined)
            base.position = "relative";
        if (base.canAddFormulaFields===undefined)
            base.canAddFormulaFields = true;
        if (base.canAddSummaryFields===undefined)
            base.canAddSummaryFields = true;
        if (base.canEditHilites===undefined)
            base.canEditHilites = true;     
        if (base.canEdit===undefined)
            base.canEdit = false;
        if (base.canAdd===undefined)
            base.canAdd = false;
        if (base.canPrint===undefined)
            base.canPrint = true;        
        base.canRemoveRecords = eng.utils.removeAttribute(base, "canRemove");
        base.showFilterEditor = eng.utils.removeAttribute(base, "showFilter");

        var totalsLabel = isc.Label.create({
            padding: 5,
        });

        var mem=[
            totalsLabel,
            isc.LayoutSpacer.create({
                width: "*"
            })
        ];
        
        var addButton;
        
        if(base.canAdd===true)
        {
            addButton = isc.ToolStripButton.create({
                //grid: grid,
                icon: "[SKIN]/actions/add.png",
                prompt: "Agregar nuevo registro",
            });            
            mem.push(addButton);
        }
        
        var printButton;
        
        if(base.canPrint===true)
        {
            printButton = isc.ToolStripButton.create({
                //grid: grid,
                icon: "[SKIN]/actions/print.png",
                prompt: "Imprimir datos",
            });            
            mem.push(printButton);
        }        
        
        var button2;
        
        if(base.canEditHilites==true)
        {
            button2 = isc.ToolStripButton.create({
                icon: "[SKIN]/actions/column_preferences.png",
                prompt: "Agregar Marcadores",
            });
            mem.push(button2);
        }
        
        var toolStrip = isc.ToolStrip.create({
            width: "100%",
            height: 24,
            members: mem,
        });
        
        if (base.gridComponents===undefined)
            base.gridComponents = ["filterEditor","header", "body","summaryRow", toolStrip];

        
        if (base.dataChanged===undefined)
            base.dataChanged = function()
            {
                this.Super("dataChanged", arguments);
                var totalRows = this.data.getLength();
                if (totalRows > 0 && this.data.lengthIsKnown()) {
                    totalsLabel.setContents(totalRows + " Registros");
                } else {
                    totalsLabel.setContents(" ");
                }
            };

        var grid = isc.ListGrid.create(base);

        if(base.canAdd===true)
        {
            if(base.addButtonClick===undefined)
            {
                addButton.click = function(p1) {
                    grid.startEditingNew(grid.initialCriteria);
                };
            }else
            {
                addButton.click = base.addButtonClick;
            }
        }
        
        if(base.canPrint===true)
        {
            if(base.printButtonClick===undefined)
            {
                printButton.click = function(p1) {
                    window.scrollTo(0, 0);
                    grid.showPrintPreview();
                };
            }else
            {
                printButton.click = base.printButtonClick;
            }
        }
        
        if(base.canEditHilites===true)
        {
            button2.click=function(p1)
            {
                grid.editHilites();
            };
        }

        return grid;
    },
            
            
            
    createForm: function(base, fetchId, dsDef)
    {
        var dsObjDef=eng.getDataSourceObjDef(dsDef);
        
        //links=eng.mergeAndArray(links,form.links);
        
        var ds = eng.createDataSource(dsObjDef);
        
        var formBase = eng.utils.cloneObject(base);

        if (formBase.numCols===undefined)
            formBase.numCols = 6;        
        //colWidths: [60, "*"],        
        if (formBase.titleAlign===undefined)
            formBase.titleAlign = "right";
        if (formBase.cellPadding===undefined)
            formBase.cellPadding = 5;
        if (formBase.dataSource===undefined)
            formBase.dataSource = ds;
        if (formBase.width)
            delete formBase.width;
        if (formBase.height)
            delete formBase.height;
        if (formBase.showTabs===undefined)
        {
            formBase.showTabs = true;
        }
        //***** nueva propiedad *********//
        if (formBase.title)
            delete formBase.title;
        
        eng.processFields(formBase.fields);

        var form = isc.DynamicForm.create(formBase);        

        var butts=[];
        
        if(!(form.canEdit===false))
        {
            var submit = isc.IButton.create(
                    {
                        title: "Guardar",
                        click: function(p1) {
                            //eng.submit(p1.target.form);
                            formsubmit = p1.target.form;
                            isc.confirm("¿Desea guardar la información?", "value = value ? 'OK' : 'Cancel'; if(value == 'OK'){eng.submit(formsubmit);}");                                              
                        }
                    });

            var print = isc.IButton.create(
                    {
                        title: "Imprimir",
                        click: function(p1) {
                          	//console.log(p1,form);
                            window.scrollTo(0, 0);
                            if(form.layout.members.length>0)                            
                          		form.layout.showPrintPreview();  
                            else 
                              	form.showPrintPreview();
                        }
                    });                


            submit.form = form;
            butts=[print,submit];
        }
        
        var pane=isc.VStack.create({
            members: [form]
        });
        
        var tabs=pane;
        
        if(formBase.showTabs===true)
        {
            var tab={
                title: base.title,
                pane: pane
            };

            tabs=isc.TabSet.create({
                ID: dsObjDef.dsName + "Tabs",
                tabs: [tab]
            });
        }
        
        var buttons=buttons=isc.HLayout.create({height: "20px", padding:"10px", membersMargin:20, align:"right", members: butts});
        
        var layout=isc.VLayout.create({
            membersMargin: 5,
            width: base.width,
            height: base.height,
            members: [
                tabs,
                buttons,
            ],
            position: "relative",
        });
        
        //tabs.setBorder("1px solid darkgray");
        layout.setZIndex(0)

        //Para tener acceso al layout desde la forma, al contenedor de botones y al boton de submit
        form.layout=layout;
        form.submitButton=submit;
        form.buttons=buttons;
        form.tindex=0;

        //Process linked objects
        
        eng.addLinks(ds.links,tabs,tab,pane,form);
        
        if (fetchId && fetchId != null)
        {
            eng.fetchForm(form, {_id: fetchId});
        }
        
        eng.resize(form);
        return form;
    },
    
    //Muestra una ventana para edicion de un objeto
    editWindowForm:function(field, fetchId, dsDef, values)
    {
        var base=eng.utils.cloneObject(field);
        
        if(values)base.values=values;
        
        var w= eng.utils.removeAttribute(base,"width");
        var h= eng.utils.removeAttribute(base,"height");
        
        var form=eng.createForm(base, fetchId, dsDef);
        
        var pane=form.parentElement;
        var tab=pane.parentElement;
        var tabs=tab.parentElement;
        //var layout=form.layout;
        
        if(!w)w="90%";
        if(!h)h="80%";        
        
        var win=isc.Window.create({
            //width:"950",
            //height:"600",
            canDragResize:true,
            title: base.title,
            width: w, //"90%",
            height: h, //"90%",
            //autoSize:true,
            autoCenter: true,
            isModal: true,
            showModalMask: true,
            autoDraw: false,
            closeClick : function () {
                this.Super("closeClick", arguments);
                //win=null;
            },
            items:[tabs,form.buttons]
        });   
        
        win.animateShow("slide", null, 500, "smoothStart");
        win.form=form;
        form.window=win;
        
        return win;
    }, 
    
    filterFields:function(fields)
    {
        ret=[];
        if(fields)
        {
            for (var x=0;x<fields.length;x++) 
            {
                var field=fields[x];
                if(field.isRemoveField)continue;
                ret[x]={};
                for (var attr in field) {
                    if (field.hasOwnProperty(attr)) 
                    {
                        if(!attr.startsWith("$") && attr!="align" && attr!="masterIndex")
                        ret[x][attr] = field[attr];
                    }
                }
            }
        }
        return ret;
    },
    
    //Procesa y transforma array de fields y procesa stypes de fields como de validators 
    processFields: function(fields)
    {
        if(fields)
        {
            for (var x=0;x<fields.length;x++) 
            {
                fields[x]=eng.processField(fields[x]);

                var validators=fields[x].validators;
                if(validators)
                {
                    for (var y=0;y<validators.length;y++) 
                    {
                        validators[y]=eng.processValidator(validators[y]);
                    }
                }
                
                if(fields[x].fields)eng.processFields(fields[x].fields);                
            }
            //console.log(data.fields);
        }        
    },
    
    //Transforma un stype en propiedades nativas del field
    processField: function(field)
    {
        var stype=field.stype;
        if(stype)
        {
            if(eng.fieldProcesors[stype])
            {
                   return eng.fieldProcesors[stype](field);
            }else
            {
                return field;
            }
        }else return field;
    },
            
    //Transforma un stype en propiedades nativas del validators        
    processValidator: function(validator)
    {
        var stype=validator.stype;
        if(stype)
        {
            var base=eng.validators[stype];
            if(base)
            {
                var ret=eng.utils.clonAndMergeObjects(base,validator);
                eng.utils.removeAttribute(ret,"stype");
                //console.log(validator);
                //console.log(base);
                //console.log(ret);                
                return ret;
            }
        }
        return validator;
    },
            

        
/*    
    baseUrl: function() 
    {
        var url=window.location.href;
        var i = url.lastIndexOf("/");
        if(i<10)
        {
            return url+"/";
        }
        return url.substring(0, i+1);
    },
            
    basePath: function() 
    {
        var url=window.location.href.split('/');
        var ret='/';
        for(var i=3;i<url.length-1;i++)
        {
            ret+=url[i]+"/";
        }
        return ret;
    },                        
*/

    //************************************ todo:eliminar metodos repetidos *********************************
    
    
    utils:{

        //Clonar un objeto 
        cloneObject:function(obj)
        {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) 
            {
                if (obj.hasOwnProperty(attr))
                {
                    copy[attr] = eng.utils.cloneObject(obj[attr]);
                }
            }
            return copy;        
            //return Object.create(obj);
            //return JSON.parse(JSON.stringify(obj));
        },

        //Clonar un objeto 
        clonAndMergeObjects:function(obj1, obj2)
        {
            var copy = eng.utils.cloneObject(obj1);
            if (null == obj2 || "object" != typeof obj2) return copy;
            for (var attr in obj2) {
                if (obj2.hasOwnProperty(attr)) copy[attr] = obj2[attr];
            }
            return copy;        
        },         
        
        /**
         * Synchonous Ajax Invocation
         * @param {type} url
         * @param {type} data
         * @param {type} method
         * @returns {XMLHttpRequest}
         */
        getSynchData: function(url,data,method)
        {
            if (typeof XMLHttpRequest === "undefined") 
            {
                XMLHttpRequest = function () {
                  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
                  catch (e) {}
                  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
                  catch (e) {}
                  try { return new ActiveXObject("Microsoft.XMLHTTP"); }
                  catch (e) {}
                  // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
                  throw new Error("This browser does not support XMLHttpRequest.");
                };
            }

            var aRequest= new XMLHttpRequest();
            if(!data)
            {
                if(!method)method="GET";
                aRequest.open(method, url, false);
                aRequest.send();
            }else
            {
                if(!method)method="POST";
                aRequest.open(method, url, false);
                aRequest.send(data);
            }
            return aRequest;
        },  

        /**
         * Dinamicaly loads a js file
         * @param {type} file
         * @param {type} eval
         * @returns {undefined}
         */
        loadJS: function(file, eval, cache)
        {
            var noEval=true;
            if(eval && eval==true)noEval=false;

            //set the returned script text while adding special comment to auto include in debugger source listing:
            var aScriptSource;
            if(cache===true)
            {
                aScriptSource = sessionStorage.getItem(file);
                if(aScriptSource==null)
                {
                    aScriptSource = eng.utils.getSynchData(file).responseText + '\n////# sourceURL=' + file + '\n';
                    sessionStorage.setItem(file,aScriptSource);
                }
            }else
            {
                aScriptSource = eng.utils.getSynchData(file).responseText + '\n////# sourceURL=' + file + '\n';
            }
            
            if(noEval)
            {
                //create a dom element to hold the code
                aScript = document.createElement('script');
                aScript.type = 'text/javascript';

                //set the script tag text, including the debugger id at the end!!
                aScript.text = aScriptSource;

                //append the code to the dom
                document.getElementsByTagName('head')[0].appendChild(aScript);
            }
            else
            {
                eval(aScriptSource);
            }
        },

        /**
         * Dinamicaly loads a css file
         * @param {type} filename
         * @returns {undefined}
         */
        loadCSS: function(filename)
        {
            var fileref=document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);

            if (typeof fileref!="undefined")
            {
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        },        
        
        /**
         * remove the attributes that start with $ of the object 
         * @param {type} obj
         * @returns {undefined}
         */
        filterObj:function(obj)
        {
            for (var attr in obj) 
            {
                if(attr.charAt(0)==='$')
                {
                    delete obj[attr];
                }
            }
        },
        
        /**
         * Copia elementos de un arreglo a otro
         * @param {type} src
         * @param {type} dest
         * @param {type} override
         * @returns {undefined}
         */
        copyAttributes:function(src, dest, override)
        {
            if(override===undefined)override=false;
            if(!src)return dest;
            for (var attr in src) 
            {
                if(attr.charAt(0)!=='$')
                {
                    if(override===true || !dest[attr])
                    {
                        dest[attr]=src[attr];
                    }
                }
            }  
            return dest;
        },
        
        clearAttributes:function(obj)
        {
            for (var prop in obj) { 
                if(prop.charAt(0)!=='$')
                {
                    delete obj[prop]; 
                }
            }            
        },
        
        //Regresa el valor de un atributo y lo elimina del objeto        
        removeAttribute: function(obj,attr)
        {
            var ret=obj[attr];
            if(ret)delete obj[attr];
            return ret;
        },        
        
        /**
         * find the herarquical parent with the name "parentName"
         * @param {string} parentName
         * @param {type} node
         * @returns {node.parentNode|eng.utils.findParentNode.testObj|testObj.parentNode.parentNode}
         */
        findParentNode: function(parentName, node) {
            var testObj = node.parentNode;
            while(testObj && testObj.tagName != parentName) {
                testObj = testObj.parentNode;
            }
            return testObj;
        },
        
        /**
         * return the URL parameter with the name "sParam"
         * @param {string} sParam
         * @returns {eng.utils.getURLParameter.sParameterName}
         */
        getURLParameter: function(sParam)
        {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) 
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) 
                {
                    return sParameterName[1];
                }
            }
        },
        
        /**
         * return the anchor parameter with the name "sParam"
         * format: #[id1]=[val1]&[id2]=[val2])&...
         * @param {type} sParam
         * @returns {eng.utils.getAnchorParameter.sParameterName}
         */
        getAnchorParameter: function(sParam)
        {
            var sPageURL = window.location.hash.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) 
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) 
                {
                    return sParameterName[1];
                }
            }
        },    
        
        /**
         * return a value in the path defined in the anchor
         * format: #[val 0]
         * format: #/[val 0]/[val 1]/...
         * @param {int} index
         * @returns {eng.utils.getAnchorPath.sParameterName}
         */
        getAnchorPath: function(index)
        {
            var sPageURL = window.location.hash.substring(1);
            if(sPageURL.charAt(0)==='/')sPageURL = sPageURL.substring(1);
            var sURLVariables = sPageURL.split('/');
            if(index < sURLVariables.length)
                return sURLVariables[index];
        }          
        
    },
    
    showError:function(error)
    {
        console.error(error);
    },
            
    //public
    /**
     * Get DataSource
     * @param {type} dsname
     * @returns {eng.dataSource}
     */
    getDataSource:function(dsname)
    {
        return {
            name:dsname,            
            getName:function ()
            {
                return this.name;
            },
            
            getDataSourceScript:function()
            {
                var dss=eng.dataSources[this.name];
                return dss
            },
            
            getDataSourceScriptField: function(name)
            {
                var fields=this.getDataSourceScript().fields;
                for (var i = fields.length; i--;) 
                {
                    var f=fields[i];
                    if(f.name==name)
                    {
                        return f;
                    }
                } 
            },
            
            invokeDS:function(data)
            {
                var res=eng.utils.getSynchData(eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath+"&ds="+this.name,JSON.stringify(data));
                if(res.status==200)
                {
                    var ret=JSON.parse(res.response);
                    if(ret.response)
                    {
                        return ret.response;
                    } 
                    else eng.showError("Bad DSResponse ("+res.response+")");
                }else eng.showError("Bad HttpResponse ("+res.status+")");               
            },
            
            fetch:function(query)
            {                
                var data=query;
                if(!data)data={};                
                data.operationType="fetch";

                var res=this.invokeDS(data);
                return res;
            },
            
            fetchObj:function(obj)
            {
                var data={};                
                if(typeof obj === "string")
                {
                    if(obj.charAt(0)==='{')
                    {
                        data.data=JSON.parse(obj);
                        return this.fetch(data);
                    }else
                    {
                        data.data={"_id":obj};
                        return this.fetch(data);
                    }
                    
                }else
                {
                    data.data=obj;
                    return this.fetch(data);
                }
            },
            
            fetchObjById:function(id)
            {
                var data={data:{"_id":id}};

                var res=this.fetch(data);
                if(res && res.status===0)return res.data[0];
            },       
            
            add:function(data)
            {
                if(!data)return;
                  
                data.operationType="add";

                var res=this.invokeDS(data);
                return res;
            },     
            
            addObj:function(obj)
            {
                eng.utils.filterObj(obj);  
                var ret=this.add({data:obj});
                if(ret && ret.status===0)obj._id=ret.data._id;
                return ret;
            },   
            
            update:function(data)
            {
                if(!data)return;
                  
                data.operationType="update";

                var res=this.invokeDS(data);
                return res;
            },     
            
            updateObj:function(obj)
            {
                eng.utils.filterObj(obj);                
                return this.update({data:obj});
            },       
            
            remove:function(data)
            {
                if(!data)return;
                  
                data.operationType="remove";

                var res=this.invokeDS(data);
                return res;
            },     
            
            removeObj:function(obj)
            {
                eng.utils.filterObj(obj);                
                return this.remove({data:obj});
            },              
            
            removeObjById:function(id)
            {
                return this.removeObj({"_id":id});
            },      
            
            validate:function(data)
            {
                if(!data)return;
                  
                data.operationType="validate";

                var res=this.invokeDS(data);
                return res;
            },     
            
            validateObj:function(obj)
            {
                eng.utils.filterObj(obj);
                return this.validate({data:obj});
            }, 
            
            $asArray:function()
            {
                var _this=this;
                var ret=this.fetch();
                var r=ret.data;
                if(!r)
                {
                    alert(ret.status);
                    r=[];
                }
                r.then=function(f)
                {
                    f();
                    return r;
                }
                r.$add=function(obj)
                {              
                    var ret=_this.addObj(obj)
                    if(ret.status===0)
                    {
                        if(obj)r.push(ret.data);
                    }else
                    {
                        alert("Error:"+ret.status);
                    }
                    return r;
                };
                r.$remove=function(obj)
                {
                    for (var i = r.length; i--;) 
                    {
                        var o=r[i];
                        if(o._id==obj._id)
                        {
                            r.splice(i, 1);
                            _this.removeObjById(obj._id);
                        }
                    }    
                    return r;
                };
                r.$save=function(obj)
                {
                    for (var i = r.length; i--;) 
                    {
                        var o=r[i];
                        if(o._id==obj._id)
                        {
                            r[i]=obj;
                            _this.updateObj(obj);
                        }
                    }     
                    return r;
                };
                r.$indexFor=function(id)
                {
                    for (var i = r.length; i--;) 
                    {
                        var o=r[i];
                        if(o._id==id)
                        {
                            return i;
                        }
                    }
                }
                return r;
            }
        };
    },
    /**
     * Login to the platform
     * @param {type} username
     * @param {type} password
     * @returns {eng.login.response}
     */
    login: function(username,password)
    {
        var data={username:username,password:password};
        data.operationType="login";

        var res=eng.utils.getSynchData(eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath,JSON.stringify(data));
        if(res.status==200)
        {
            var ret=JSON.parse(res.response).response; 
            if(ret.data)
            {
                eng._u={usr:ret.data};
            }
            return ret;
        }        
    },
    /**
     * Logout to the platform
     * @returns {eng.logout.response}
     */
    logout: function()
    {
        var data={};
        data.operationType="logout";

        var res=eng.utils.getSynchData(eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath,JSON.stringify(data));
        if(res.status==200)
        {
            eng._u={usr:undefined};
            return JSON.parse(res.response).response; 
        }        
    },    
    /**
     * Get the user object if exist or undefined if not loged
     * @returns {eng.user}
     */
    getUser: function()
    {
        if(eng._u)
        {
            return eng._u.usr;
        }else
        {
            var data={};
            data.operationType="user";

            var res=eng.utils.getSynchData(eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath,JSON.stringify(data));
            if(res.status==200)
            {
                var ret=JSON.parse(res.response).response; 
                if(ret.data)
                {
                    eng._u={usr:ret.data};
                }else
                {
                    eng._u={usr:undefined};
                }
                return eng._u.usr;
            }    
        }
    },    
    

    getContextData: function(key)
    {
        var data={};
        data.operationType="contextData";
        data.dataKey=key;

        var res=eng.utils.getSynchData(eng.dataSourceServlet+"?dssp="+eng.dataSourceScriptPath,JSON.stringify(data));
        if(res.status==200)
        {
            var ret=JSON.parse(res.response).response; 
            return ret.data;
        }    
    },       
    
//**********************************************    
    
    findLinkObjectId:function(ds, prop, lid)
    {
        var q={};
        q[prop]=lid;
        var data=eng.getDataSource(ds).fetch({data:q}).data;
  	var id=null;
  	if(data && data[0])id=data[0]._id;        
        return id;
    },
    
    initPlatform: function(file, cache)
    {
        if(!cache && cache!=false)
        {
            cache=true;
        }
        if(!eng.inited)
        {
            eng.inited=true;     

            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Core.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Foundation.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Containers.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Grids.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Forms.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_DataBinding.js",false,true);
            eng.utils.loadJS(isomorphicDir+"system/modules/ISC_Calendar.js",false,true);
            eng.utils.loadJS(isomorphicDir+"skins/Enterprise/load_skin.js",false,true);
            eng.utils.loadJS(isomorphicDir+"locales/frameworkMessages_es.properties",false,true);
            eng.utils.loadJS("/swbforms/plupload/js/plupload.full.min.js",false,true);
            
            isc.DateItem.DEFAULT_START_DATE.setYear(1900);
            Time.setDefaultDisplayTimezone("-06:00");
            Time.adjustForDST=false;
            
            if(file)
            {
                if(file.charAt(0)!='/')
                {
                    eng.dataSourceScriptPath=window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/'))+"/"+file;
                }else
                {
                    eng.dataSourceScriptPath=file;
                }

                eng.utils.loadJS("/swbforms/js/eng_lang.js",false,cache);
                eng.utils.loadJS(file,false,cache);     
            }
        }
    }
    
};

eng.dataStores["mongodb"]={};
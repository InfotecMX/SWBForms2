<%@page import="com.mongodb.util.JSON"%><%@page import="java.io.*"%><%@page import="java.util.*"%><%@page import="org.semanticwb.datamanager.*"%><%@page contentType="text/xml" pageEncoding="UTF-8"%><%!
//global

    /**
     * Lee el contenido del InputStream y lo convierte a un String, con la
     * codificacion especificada
     *
     * @param inputStream
     * @param encoding
     * @return
     * @throws IOException
     */
    public String readInputStream(InputStream inputStream, String encoding) throws IOException {
        return new String(readFully(inputStream), encoding);
    }

    public byte[] readFully(InputStream inputStream) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        while ((length = inputStream.read(buffer)) != -1) {
            baos.write(buffer, 0, length);
        }
        return baos.toByteArray();
    }

    DataObject getOperation(DataObject json, SWBScriptEngine engine, String dataSource, HttpSession session) throws IOException
    {
        DataObject ret=null;
        String operationType = json.getString("operationType");
        
        if(dataSource==null && operationType!=null)
        {
            if (SWBDataSource.ACTION_LOGIN.equals(operationType))
            {
                SWBDataSource users=engine.getDataSource("User");
                DataObject q=new DataObject();
                DataObject d=new DataObject();
                q.put("data", d);
                d.put("email", json.getString("username"));
                d.put("password", json.getString("password"));
                DataObject r=users.fetch(q);
                //TODO:Eliminar response del fetch
                DataObject resp=(DataObject)r.get("response");
                DataList rdata=(DataList)resp.get("data");
                if(rdata!=null && rdata.size()>0)
                {
                    DataObject user=(DataObject)rdata.get(0);
                    user.put("isSigned", "true");
                    user.put("signedAt", java.time.Instant.now().toString());
                    session.setAttribute("_USER_", user);                    
                    ret=SWBDataSource.getError(0);
                    DataObject resp2=(DataObject)ret.get("response");
                    resp2.put("data",user);
                }else
                {
                    ret=SWBDataSource.getError(-1);
                }
            }else if (SWBDataSource.ACTION_LOGOUT.equals(operationType))
            {
                session.removeAttribute("_USER_");
                ret=SWBDataSource.getError(0);
            }else if (SWBDataSource.ACTION_USER.equals(operationType))
            {
                DataObject user=(DataObject)session.getAttribute("_USER_");
                ret=SWBDataSource.getError(0);
                DataObject resp2=(DataObject)ret.get("response");
                resp2.put("data",user);
            }else if (SWBDataSource.ACTION_CONTEXTDATA.equals(operationType))
            {
                Object data=session.getAttribute("ctx_"+json.getString("dataKey"));
                ret=SWBDataSource.getError(0);
                DataObject resp2=(DataObject)ret.get("response");
                resp2.put("data",data);
            }        
        }else
        {
            SWBDataSource ds=engine.getDataSource(dataSource);
            //System.out.println("ds:"+dataSource+" "+ds);        

            if(ds!=null)
            {
                if (SWBDataSource.ACTION_FETCH.equals(operationType))
                {
                    ret=ds.fetch(json);
                } else if (SWBDataSource.ACTION_AGGREGATE.equals(operationType))
                {
                    ret=ds.aggregate(json);
                } else if (SWBDataSource.ACTION_UPDATE.equals(operationType))
                {
                    ret=ds.update(json);
                } else if (SWBDataSource.ACTION_ADD.equals(operationType))
                {
                    ret=ds.add(json);
                } else if (SWBDataSource.ACTION_REMOVE.equals(operationType))
                {
                    ret=ds.remove(json);
                } else if (SWBDataSource.ACTION_VALIDATE.equals(operationType))
                {
                    ret=ds.validate(json);
                } 
    /*            
                List<SWBDataService> dataServices=engine.findDataServices(dataSource, operationType);
                if(dataServices!=null)
                {
                    Iterator<SWBDataService> dsit=dataServices.iterator();
                    while(dsit.hasNext())
                    {
                        SWBDataService dsrv=dsit.next();
                        ScriptObject func=dsrv.getDataServiceScript().get("service");
                        if(func!=null && func.isFunction())
                        {
                            func.invoke(json,ret.get("response"),"TODO:User");
                        }
                    }            
                }
    */        
            }else
            {
                ret=SWBDataSource.getError(-1);
            }    
        }
        return ret;
    }
    
%><%
    
    DataObject user=(DataObject)session.getAttribute("_USER_");
    
    //init SWBPlatform
    if (DataMgr.getApplicationPath() == null)
    {
        String apppath = config.getServletContext().getRealPath("/");
        DataMgr.createInstance(apppath);
    }            
    
    DataObject json=null;
    try
    {
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");
        
        String in=readInputStream(request.getInputStream(),"utf-8");
        json=(DataObject)DataObject.parseJSON(in);
        
        String dssp = request.getParameter("dssp");    
        String ds = request.getParameter("ds");    
        SWBScriptEngine engine=DataMgr.getUserScriptEngine(dssp,user,false);
        //System.out.println("engine:"+engine);        
        
        //JSONObject json = new JSONObject(in);
        //System.out.println("in:"+json);
        
        DataObject transaction = (DataObject)json.get("transaction");
        if(transaction!=null)
        {
            DataList ret=new DataList();
            DataList operations = (DataList)transaction.get("operations");
            Iterator it=operations.iterator();
            while (it.hasNext()) 
            {
                    DataObject json2 = (DataObject)it.next();                         
                    DataObject r=getOperation(json2,engine,ds,session);
                    DataObject resp = (DataObject)r.get("response");   
                    //System.out.println("resp:"+resp+" "+json2);
                    if(resp!=null)resp.put("queueStatus", resp.getInt("status"));
                    ret.add(r);
            }
            out.print("<SCRIPT>//'\"]]>>isc_JSONResponseStart>>"+ret+"//isc_JSONResponseEnd");
            //System.out.println("out:"+ret);
        }else
        {
            DataObject ret=getOperation(json,engine,ds,session);
            if(ret!=null)
            {
                out.print(ret);
            }else
            {
                out.print(SWBDataSource.getError(-1));
            }
        }
    } catch (Throwable e)
    {
        e.printStackTrace();
        System.out.println("Error"+json);
        DataObject ret=SWBDataSource.getError(-1);
        ret.getDataObject("response").addParam("data", e.getMessage());
        out.print(ret);
    }
%>
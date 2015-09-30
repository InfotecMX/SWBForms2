<%-- 
    Document   : dataSourceEditor.jsp
    Created on : Feb 4, 2014, 4:33:43 PM
    Author     : javier.solis.g
--%><%@page import="java.io.*"%><%@page import="java.net.URLEncoder"%><%@page contentType="text/html" pageEncoding="UTF-8"%><%!
    byte[] readInputStream(InputStream in) throws IOException
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        while ((length = in.read(buffer)) != -1) {
            baos.write(buffer, 0, length);
        }   
        return baos.toByteArray();
    }
%><%
    String dir = config.getServletContext().getRealPath("/") + "/" + request.getRequestURI().substring(1, request.getRequestURI().lastIndexOf("/")) + "/";
    System.out.println(dir);
    
    String upload = request.getParameter("up");         
    if(upload!=null)
    {
        System.out.println(upload);

        byte code[]=readInputStream(request.getInputStream());
        
        try {
            FileOutputStream os = new FileOutputStream(dir+upload);
            os.write(code);
            os.flush();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }        
        
        out.print("OK");
        return;
    }
    
    String filename = request.getParameter("fn");
   

    boolean lint=false;
    String mode="text/html";
    if(filename!=null)
    {
        if(filename.endsWith(".js"))           
        {
            mode="text/javascript";
            lint=true;
        }else if(filename.endsWith(".json"))
        {
            mode="application/json";
            lint=true;
        }else if(filename.endsWith(".html"))
        {
            mode="text/html";
        }else if(filename.endsWith(".jsp"))
        {
            mode="application/x-jsp";
        }else if(filename.endsWith(".css"))
        {
            mode="text/css";
            lint=true;
        }else if(filename.endsWith(".xml"))
        {
            mode="text/xml";
        }else if(filename.endsWith(".rdf"))
        {
            mode="text/xml";
        }else if(filename.endsWith(".owl"))
        {
            mode="text/xml";
        }
    }
    
    
    String path = null;
    if (filename != null) {
        path = dir + filename;
    }
    
    String code="";

    if (path != null) {
        try {
            FileInputStream in = new FileInputStream(path);

            code = new String(readInputStream(in), "utf-8");

            //code=ITZFormsUtils.readInputStream(in,"utf-8");
            code = code.replace("<", "&lt;").replace(">", "&gt;");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //if(code==null)code="";
    //if(filename==null)filename="";
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <link rel="stylesheet" href="/swbforms/codemirror/lib/codemirror.css">
        <link rel="stylesheet" href="/swbforms/codemirror/addon/hint/show-hint.css">
        <link rel="stylesheet" href="/swbforms/codemirror/theme/eclipse.css">   
        <link rel="stylesheet" href="/swbforms/codemirror/addon/dialog/dialog.css">
        <link rel="stylesheet" href="/swbforms/codemirror/addon/lint/lint.css">  
        

        <script src="/swbforms/codemirror/lib/codemirror.js"></script>  
        <script src="/swbforms/codemirror/addon/hint/show-hint.js"></script>
        <script src="/swbforms/codemirror/addon/selection/active-line.js"></script> 
        <script src="/swbforms/codemirror/addon/lint/lint.js"></script>       
        <script src="/swbforms/codemirror/addon/search/search.js"></script> 
        <script src="/swbforms/codemirror/addon/search/searchcursor.js"></script>
        <script src="/swbforms/codemirror/addon/dialog/dialog.js"></script>
        
        
        <script src="/swbforms/codemirror/mode/xml/xml.js"></script>
        <script src="/swbforms/codemirror/addon/hint/xml-hint.js"></script>
        
        <script src="/swbforms/codemirror/mode/javascript/javascript.js"></script>
        <script src="/swbforms/codemirror/addon/hint/javascript-hint.js"></script>
        <script src="/swbforms/codemirror/addon/lint/javascript-lint.js"></script>
        <script src="//ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"></script>
        
        <script src="/swbforms/codemirror/addon/lint/json-lint.js"></script>
        <script src="https://rawgithub.com/zaach/jsonlint/79b553fb65c192add9066da64043458981b3972b/lib/jsonlint.js"></script>
        
        <script src="/swbforms/codemirror/addon/edit/matchbrackets.js"></script>  
        <script src="/swbforms/codemirror/addon/edit/closebrackets.js"></script>  
        <script src="/swbforms/codemirror/addon/comment/continuecomment.js"></script>
        <script src="/swbforms/codemirror/addon/comment/comment.js"></script> 
        
        <script src="/swbforms/codemirror/mode/css/css.js"></script>
        <script src="/swbforms/codemirror/addon/hint/css-hint.js"></script>
        <script src="/swbforms/codemirror/addon/lint/css-lint.js"></script>
        <script src="https://rawgithub.com/stubbornella/csslint/master/release/csslint.js"></script>        
        
        <script src="/swbforms/codemirror/mode/clike/clike.js"></script>
        
        <script src="/swbforms/codemirror/mode/htmlmixed/htmlmixed.js"></script>
        <script src="/swbforms/codemirror/mode/htmlembedded/htmlembedded.js"></script>
        <script src="/swbforms/codemirror/addon/hint/html-hint.js"></script>
        <script src="/swbforms/codemirror/addon/mode/multiplex.js"></script>
        <script src="/swbforms/codemirror/addon/fold/xml-fold.js"></script>
        <script src="/swbforms/codemirror/addon/edit/matchtags.js"></script>        
        
       <!--
        <sc´ript src="/swbforms/codemirror/addon/edit/closetag.js"></script>
        -->
                       

        <style type="text/css">
            .CodeMirror {border: 1px solid black; font-size:13px}
        </style>      
    </head>
    <body>
        <h1>Code Editor</h1>
        <form action="" method="post" style="float: left;">   
            Archivo: 
            <input type="hidden" id="fn" name="fn">
            <select name="sfn" onchange="
                    if (value == '_new')
                        document.getElementById('fn').value = prompt('File Name', '[File Name]');
                    else
                        document.getElementById('fn').value = value;
                    submit();
                    ">

                <%
                    if (filename == null) {
                        out.println("<option></option>");
                    }
                    String selected = "";
                    boolean fselected = false;
                    File d = new File(dir);
                    File[] files = d.listFiles();
                    for (int x = 0; x < files.length; x++) {
                        if (filename != null && filename.equals(files[x].getName())) {
                            selected = "selected";
                            fselected = true;
                        } else {
                            selected = "";
                        }
                        out.println("<option value=\"" + files[x].getName() + "\" " + selected + ">" + files[x].getName() + "</option>");
                    }
                    if (filename != null && fselected == false) {
                        out.println("<option value=\"" + filename + "\" selected>" + filename + "</option>");
                    }
                %>            
                <option value="_new">[New File]</option>
            </select>
        </form>
              
            <%
                if (code != null) {
            %>
            <input type="button" value="Guardar" onclick="r=getSynchData('?up=<%=filename!=null?URLEncoder.encode(filename):""%>',myCodeMirror.getValue(),'POST');console.log(r);if(r.response==='OK')alert('Archivo Gradado');else alert('Error al guardar archivo')">
            <textarea name="code" id="code"><%=code%></textarea>           
            <script type="text/javascript">
                
                var getSynchData=function(url,data,method)
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
                };                
                
                var myCodeMirror = CodeMirror.fromTextArea(code, {
                    //mode: "application/x-jsp",
                    mode: "<%=mode%>",
                    smartIndent: true,
                    lineNumbers: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    theme: "eclipse",
                    continueComments: "Enter",
                    extraKeys: {"Ctrl-Space": "autocomplete","Ctrl-Q": "toggleComment","Ctrl-J": "toMatchingTag"},
                    matchTags: {bothTags: true},                  
                    <%if(lint){%>
                    gutters: ["CodeMirror-lint-markers"],
                    lint: true,
                    <%}%>
                });
                myCodeMirror.setSize("100%", 500);
            </script>      
            <%
                }
            %>            
    </body>
</html>

<%@page import="org.apache.commons.fileupload.*"%><%@page import="java.io.*"%><%@page import="org.apache.commons.fileupload.util.*"%><%@page import="org.apache.commons.fileupload.servlet.*"%><%!
    private static final String RESP_SUCCESS = "{\"jsonrpc\" : \"2.0\", \"result\" : \"success\", \"id\" : \"id\"}";
    private static final String RESP_ERROR = "{\"jsonrpc\" : \"2.0\", \"error\" : {\"code\": 101, \"message\": \"Failed to open input stream.\"}, \"id\" : \"id\"}";
    public static final String JSON = "application/json";
    public static final int BUF_SIZE = 2 * 1024;
    public static final String FileDir = "/uploadfile/";

    private int chunk;
    private int chunks;
    private String name;
    private String user;
    private String time;

    /**
     * Handles an HTTP POST request from Plupload.
     *
     * @param req The HTTP request
     * @param resp The HTTP response
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String responseString = RESP_SUCCESS;
        boolean isMultipart = ServletFileUpload.isMultipartContent(req);

        if (isMultipart) {
            ServletFileUpload upload = new ServletFileUpload();
            try {
                FileItemIterator iter = upload.getItemIterator(req);
                while (iter.hasNext()) {
                    FileItemStream item = iter.next();
                    System.out.println(item.getContentType()+":"+item.getFieldName()+":"+item.getName()+":"+item.isFormField());
                    
                    InputStream input = item.openStream();
                    
                    // Handle a form field.
                    if (item.isFormField()) {
                        String fileName = item.getFieldName();
                        String value = Streams.asString(input);
                        System.out.println(fileName+":"+value);
                        
                        if ("name".equals(fileName)) {
                            this.name = value;
                        } else if ("chunks".equals(fileName)) {
                            this.chunks = Integer.parseInt(value);
                        } else if ("chunk".equals(fileName)) {
                            this.chunk = Integer.parseInt(value);
                        } else if ("user".equals(fileName)) {
                            this.user = value;
                        } else if ("time".equals(fileName)) {
                            this.time = value;
                        } else if ("file".equals(fileName)) {
                            System.out.println("file:"+value);
                        }
                    } // Handle a multi-part MIME encoded file.
                    else {
                        String fileDir = req.getSession().getServletContext().getRealPath("/") + FileDir;
                        File dstFile = new File(fileDir);
                        if (!dstFile.exists()) {
                            dstFile.mkdirs();
                        }

                        String fname=this.name;
                        int i=fname.lastIndexOf('.');
                        if(i>-1)fname=fname.substring(0,i);
                        
                        File dst = new File(dstFile.getPath() + "/" + fname);
                        System.out.println("dst:"+dst);

                        saveUploadFile(input, dst);
                    }
                }
            } catch (Exception e) {
                responseString = RESP_ERROR;
                e.printStackTrace();
            }
        } // Not a multi-part MIME request.
        else {
            responseString = RESP_ERROR;
        }

        if (this.chunk == this.chunks - 1) {
            System.out.println("User:" + this.user);
            System.out.println("name:" + this.name);
            System.out.println("Time:" + this.time);
        }

        resp.setContentType(JSON);
        byte[] responseBytes = responseString.getBytes();
        resp.setContentLength(responseBytes.length);
        ServletOutputStream output = resp.getOutputStream();
        output.write(responseBytes);
        output.flush();
    }

    /**
     * Saves the given file item (using the given input stream) to the web
     * server's local temp directory.
     *
     * @param input The input stream to read the file from
     * @param dst The dir of upload
     */
    private void saveUploadFile(InputStream input, File dst) throws IOException {
        OutputStream out = null;
        try {
            if (dst.exists()) {
                out = new BufferedOutputStream(new FileOutputStream(dst, true),
                        BUF_SIZE);
            } else {
                out = new BufferedOutputStream(new FileOutputStream(dst),
                        BUF_SIZE);
            }

            byte[] buffer = new byte[BUF_SIZE];
            int len = 0;
            while ((len = input.read(buffer)) > 0) {
                out.write(buffer, 0, len);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (null != input) {
                try {
                    input.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (null != out) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

%><%
  doPost(request, response);
%>
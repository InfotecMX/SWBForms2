/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.swbforms.servlet;

import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

@WebListener
public class FormsServletContextListener implements ServletContextListener {

    static Logger log = Logger.getLogger(FormsServletContextListener.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("Starting SWBForms");
        DataMgr.createInstance(sce.getServletContext().getRealPath("/"));
        log.info("SWBForms DataMgr Started");

        SWBScriptEngine engine = DataMgr.getUserScriptEngine("/WEB-INF/global.js", (DataObject)null, false);
        log.info("SWBForms SWBScriptEngine Started");

        ScriptObject config = engine.getScriptObject().get("config");
        if (config != null) {
            String base = config.getString("baseDatasource");
            if (base != null) {
                DataMgr.getBaseInstance().setBaseDatasourse(base);
            }
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("aplicacion web parada");
    }
}

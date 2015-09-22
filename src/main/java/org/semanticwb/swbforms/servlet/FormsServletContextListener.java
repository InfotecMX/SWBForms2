/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.swbforms.servlet;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;
import org.semanticwb.swbforms.servlet.router.Router;

@WebListener
public class FormsServletContextListener implements ServletContextListener {

    static Logger log = Logger.getLogger(FormsServletContextListener.class.getName());
    ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("Starting SWBForms");
        DataMgr.createInstance(sce.getServletContext().getRealPath("/"));
        log.info("SWBForms DataMgr Started");

        SWBScriptEngine engine = DataMgr.getUserScriptEngine("/WEB-INF/global.js", null, false);
        log.info("SWBForms SWBScriptEngine Started");

        ScriptObject config = engine.getScriptObject().get("config");
        if (config != null) {
            String base = config.getString("baseDatasource");
            if (base != null) {
                DataMgr.getBaseInstance().setBaseDatasourse(base);
            }
        }

        log.info("Configuring Router");
        ScriptObject ros = engine.getScriptObject().get("routes");
        Router.initRouter(ros);
        log.info("Router configured");
        try {
            WatchService wservice = FileSystems.getDefault().newWatchService();
            Path file = Paths.get(DataMgr.getApplicationPath(), "/WEB-INF/global.js").getParent().toAbsolutePath();
            WatchKey key = file.register(wservice, StandardWatchEventKinds.ENTRY_MODIFY);
            service.scheduleWithFixedDelay(() -> {
                key.pollEvents().stream().forEach((f) -> {
                    if ("global.js".equals(f.context().toString())) {
                        SWBScriptEngine engine1 = DataMgr.getUserScriptEngine("/WEB-INF/global.js", null, false);
                        ScriptObject ros1 = engine1.getScriptObject().get("routes");
                        Router.initRouter(ros1);
                    }
                });
            }, 10, 10, TimeUnit.SECONDS);
        } catch (IOException | UnsupportedOperationException pex) {
            log.log(Level.SEVERE, "Error Reloading routes from global.js file ", pex);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("aplicacion web parada");
        try {
            service.shutdownNow();
            service.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException iex) {
            log.log(Level.SEVERE, "Shootingdown", iex);
        }
    }
}

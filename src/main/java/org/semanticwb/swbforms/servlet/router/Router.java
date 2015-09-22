package org.semanticwb.swbforms.servlet.router;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.script.ScriptObject;

/**
 *
 * @author serch
 */
public class Router {

    private static final Logger logger = Logger.getLogger("i.c.s.r.Router");
    private static Router instance = null;
    private final Map<String, RouteHandler> routes = new ConcurrentHashMap<>();
    private final Set<String> securedRoutes = new TreeSet<>();
    private final String loginRoute;

    private Router(ScriptObject config) {
        loginRoute = (null == config.getString("loginFallback") ? "login" : config.getString("loginFallback"));
        ScriptObject routesFile = config.get("routeList");
        if (routesFile.isArray()) {
            routesFile.values().forEach(this::process);
        }
    }

    public static RouteHandler getHandler(final String path, final DataObject user) {
        return instance.getRouterHandler(path, user);
    }

    public static synchronized void initRouter(ScriptObject config) {
        instance = new Router(config);
    }

    private void process(ScriptObject path) {
        try {
            if ("true".equalsIgnoreCase(path.getString("isRestricted"))) {
                securedRoutes.add(path.getString("routePath"));
            }
            if (null != path.getString("forwardTo")) {
                final String jspRoute = path.getString("forwardTo");
                RouteHandler rh = (HttpServletRequest request, HttpServletResponse response) -> {
                    request.getServletContext().getRequestDispatcher(jspRoute).forward(request, response);
                };
                routes.put(path.getString("routePath"), rh);
                return;
            }
            if (null != path.getString("jspMapTo")) {
                final String jspRoute = path.getString("jspMapTo");
                RouteHandler rh = new RouteHandler() {
                    private final String mapTo = jspRoute;

                    @Override
                    public void handle(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
                        String name = request.getRequestURI();
                        name = mapTo + name.substring(name.lastIndexOf("/") + 1) + ".jsp";
                        logger.fine("name: " + name);
                        logger.fine("realName: " + request.getServletContext().getRealPath(name));
                        if (Files.exists(Paths.get(request.getServletContext().getRealPath(name)))) {
                            request.getServletContext().getRequestDispatcher(name).forward(request, response);
                        } else {
                            name = request.getRequestURI().substring(request.getContextPath().length()).substring(1);
                            name = name.substring(0, name.indexOf("/"));
                            if (routes.containsKey(name)) {
                                logger.fine("encontré handler de " + name);
                                routes.get(name).handle(request, response);
                            } else {
                                name = request.getRequestURI();
                                name = mapTo + name.substring(name.lastIndexOf("/") + 1) + "index.jsp";
                                logger.fine("buscando si hay " + name);
                                if (Files.exists(Paths.get(request.getServletContext().getRealPath(name)))) {
                                    request.getServletContext().getRequestDispatcher(name).forward(request, response);
                                } else {
                                    response.sendError(404, request.getRequestURI() + " not found!");
                                }
                            }
                        }
                    }
                };
                routes.put(path.getString("routePath"), rh);
                return;
            }
            if (null == path.getString("routeHandler")) {
                return;
            }
            RouteHandler rh = (RouteHandler) Class.forName(path.getString("routeHandler")).newInstance();
            routes.put(path.getString("routePath"), rh);
        } catch (ReflectiveOperationException cnf) {
            logger.log(Level.SEVERE, "****** Can''t load class: {0}", path.getString("routeHandler"));
            Runtime.getRuntime().exit(10);
        }
    }

    private RouteHandler getRouterHandler(final String path, final DataObject user) {
        final String routeb = path.substring(1);
        String route = null;
        if (routeb.contains("/")) {
            route = routeb.substring(0, routeb.indexOf("/"));
        } else {
            route = routeb;
        }
        logger.fine("processing route: " + route);
        if (securedRoutes.contains(route)
                && ((null == user)
                || !"true".equalsIgnoreCase(user.getString("isSigned")))) {
            return routes.get(loginRoute);
        }
        if (routes.containsKey(routeb)) {
            return routes.get(routeb);
        }
        final String routeJsp = routeb.substring(0, routeb.lastIndexOf("/") + 1) + "*";
        if (routes.containsKey(routeJsp)) {
            return routes.get(routeJsp);
        }
        return routes.get(route);
    }
}

package org.semanticwb.swbforms.servlet.router;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author serch
 */
public interface RouteHandler {
    void handle(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException;
}

function handler(event) {
    var response = event.response;
    var headers = response.headers;

    // HSTS - Force HTTPS for 1 year including subdomains (apenas para conexões HTTPS)
    headers['strict-transport-security'] = { value: 'max-age=31536000; includeSubDomains; preload' };
    
    // Prevent MIME type sniffing
    headers['x-content-type-options'] = { value: 'nosniff' };
    
    // Prevent clickjacking - permite embedding em qualquer domínio
    headers['x-frame-options'] = { value: 'ALLOWALL' };
    
    // XSS Protection (legacy browsers)
    headers['x-xss-protection'] = { value: '1; mode=block' };
    
    // Referrer Policy
    headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };
    
    // Content Security Policy - Permite Google Fonts e mixed content
    headers['content-security-policy'] = { 
        value: "default-src 'self'; " +
               "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
               "font-src 'self' data: https://fonts.gstatic.com; " +
               "img-src 'self' data: https: http:; " +
               "connect-src 'self' https://api.arenaticket.gdse.ao http://100.24.196.140 https://arenatiket.onrender.com https://*.onrender.com; " +
               "frame-ancestors *; " +
               "base-uri 'self'; " +
               "form-action 'self'"
    };
    
    // Permissions Policy (formerly Feature Policy)
    headers['permissions-policy'] = { 
        value: 'geolocation=(), microphone=(), camera=(), payment=()' 
    };

    return response;
}

kinetic-observer
================

Getting Started
------------------

An example file `app-kinetics.js` is available in the repository. **Include it in your project but 
not before revising three Javascript functions to adapt to your application.** 
Sample implementations of the functions are provided.

 1. `get_site_key` parses the URL to decide the application instance being served - we can provide the keys
 1. `ak_get_user_id` obtains the user ID from the page. Usually the user ID is displayed on a page somewhere.
 1. `ak_get_session_id` obtains the session ID. It is usually available in a cookie. 
 Session ID's are important for tracking if, for example, the same user ID is being used by multiple users.
 This function is optional. If not needed, it can be replaced by a single line `return 'SessionCookieNotImplemented';`.

To monitor page loads using App Kinetics, include these lines in your HTML files, immediately before or after your analytics snippet. 

    <script type="text/javascript">
      if(typeof appKineticsPageLoad == 'function') {
        appKineticsPageLoad();
      };
    </script>

To monitor Ajax-based web applications, you need a decorator snippet. It looks like this:

    if ('undefined'==typeof ak_jq_ajax_decorated && typeof jQuery.ajax == 'function'){
        jQuery.ajax = appKineticsAjaxDecorator(jQuery.ajax);
        ak_jq_ajax_decorated=1;
    }

The decorator snippet should be placed such that it is invoked after the ajax library has been loaded. We assume jQuery ajax in this writeup. It applies equally well if you are using some other library.

Occasionally we see applications that have more than one ajax function. They would each need to be decorated as shown above.

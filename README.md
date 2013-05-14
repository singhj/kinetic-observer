kinetic-observer
================

Observation API for App Kinetics

The API is a REST API for applications to send data. It supports these calls:

 1. POST `/api/1/databases/`***app-key***`/collections/`***data-type***`/` and
 2. GET `/api/1/databases/`***app-key***`/collections/`***data-type***`/collect/`

In the above, `app-key` and `data-type` are setup parameters. They are provided to the application owner when they sign up. They need to be kept secure. You will need separate keys for each of your instances, for example *development*, *QA*, *production*, etc.

Notes:
 1. The trailing slashes on the URLs have an effect on performance. You want them there.
 2. The requests should be sent to `app-collect.earlystageit.com` using `http` or `https`.
 3. Data from a browser should be sent using the GET interface. POST interface is also supported and more secure but make sure you test it with IE. It does work for all other browsers.
 4. Data from a server should be sent using the POST interface. `https` isn't always available when originating from the server and for extra security, a method of signing POST requests is available. Ask us about details.
 5. The API calls should be protected inside try/catch blocks so errors in the API don't affect your application's operation.

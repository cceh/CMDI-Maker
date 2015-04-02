CMDI-Maker
==========

A tool for easily creating XML files on the basis of handsome forms.

Available on: http://cmdi-maker.uni-koeln.de


# Build instructions #

1. To build CMDI Maker using gulp, make sure to have gulp and all packages that are required in the gulpfile installed and ready.
2. Configure gulpfile.js so that environment scripts of the environments you want to provide with this CMDI Maker build are added to the array environment_scripts and environment css files to environment_stylesheets. These files will be added to the index.html as well as to cmdi-maker.appcache under the CACHE section, so that they are cached and available offline.
3. Then just run the default task in the gulpfile.js (usually done by typing "gulp" in the npm command line")
4. After that, provide all environment files for CMDI Maker. They should be put in the same directory as the CMDI Maker build. Of course they must be exactly where you have specified them in Step 2.

When deploying on a server, all kinds of caching must be disabled. Otherwise, the update mechanism may not work correctly. This is done by adding the following headers to all HTTP responses:

* Expires: 0
* Pragma: no-cache
* Cache-Control: no-cache, must-revalidate, post-check=0, pre-check=0

Notice: It is not recommended to use Cache-Control: no-store, since this would prevent Firefox from storing the App in the appcache at all and in the console it says:
* "Offline cache manifest item has Cache-control: no-store header"
Maybe this is a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=959008
Since Chrome does neglect no-cache header (see https://code.google.com/p/chromium/issues/detail?id=64139 and https://code.google.com/p/chromium/issues/detail?id=28035)
there seems to be no perfect solution at this point.

No ETag header must be present!

In Apache Web Server, this is done by adding these commands:
* FileETag None
* Header unset ETag

Make sure, that appcache files are served with the correct mime type.
For example, to serve this mime-type in Apache, add this line to your config file:
* AddType text/cache-manifest .appcache
CMDI-Maker
==========

A tool for easily creating XML files on the basis of handsome forms.

Available on: http://cmdi-maker.uni-koeln.de


# Build instructions #

1. To build CMDI Maker using gulp, make sure have gulp and all packages that are required in the gulpfile installed and ready.
2. Configure gulpfile.js so that environment scripts are added to environment_scripts and environment css files to environment_stylesheets. These files will be added to the index.html as well as to cmdi-maker.appcache under the CACHE section, so that they are cached and available offline.
3. Then just run the default task in the gulpfile.js
4. After that, provide all environment files for CMDI Maker, ideally in the same directory as the CMDI Maker build. Of course they should be exactly where you have specified them in Step 2.
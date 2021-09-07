# REDCapOMR
A project aiming to implement OMR and paper survey support into REDCap with the use of SDAPS and other software.  This is an external application currently only tested on a Linux distribution with PHP's localhost command line server.  Currently being built and implemented for use in a Docker container.

TODO:
* Add router function and function classes
* Change location of Docker files(?)
* Upload scans uploaded by the user to their corresponding REDCap records when results are exported,
* NOTE: Above point is not implemented.  It MAY have to be implemented based on the user's filenames for the scanned pdf files, which would require more specific user actions
* Have the project capable of running in a Docker instance, fix the Dockerfile/dependencies so it can support the recognize step.
NOTE: All other steps work.  It seems to be an issue with SDAPS requiring the D-Bus for this to function properly, which could mean that Ubuntu or another Linux OS would have to be partially installed for this app to work in a container.
* WE NEED D-BUS COMMUNICATION!!!

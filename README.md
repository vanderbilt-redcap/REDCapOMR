# REDCapOMR
A project aiming to implement OMR and paper survey support into REDCap with the use of SDAPS and other software.  This is an external application currently only tested on a Linux distribution with PHP's localhost command line server.  Don't expect it to be functional in most circumstances yet.

(In logical order)

TODO: 
* Fix bugs with PHP "error" echo messages being captured in the success Ajax method.  Will likely need to encode a JSON field called "error" to catch these in success.
* Upload scans uploaded by the user to their corresponding REDCap records when results are exported,
* NOTE: Above point is only partially implemented.  It MAY have to be implemented based on the user's filenames for the scanned pdf files.
* Create a Dockerfile and have the project capable of running in a Docker instance (working on currently)

# REDCapOMR
A project aiming to implement OMR and paper survey support into REDCap with the use of SDAPS and other software.  This is an external application currently only tested on a Linux distribution with PHP's localhost command line server.  Currently being built and implemented for use in a Docker container.

TODO:
* Add router function and function classes
* Change location of Docker files(?)
* Upload scans uploaded by the user to their corresponding REDCap records when results are exported,
* Clean up Export Results page and possibly add ability for users to check the record rows they want exported (in case some have bad values)

Note: I had a weird bug during development where my PC crashed (Windows) when loading the container.  When I restarted, Docker couldn't start the container because an old service was holding port 8080 captive in a sense.  I restarted the Docker service then restarted my computer and it worked fine again.  It's an issue that could stand to be monitored more.

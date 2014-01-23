

Background
----------

You need a modern web browser.

Recent versions of Firefox and Chrome are popular choices.

Mobile versions of Firefox and Chrome also work well.
Ericsson Bowser for Android is another possible browser.

Sample site
-----------

You can see a sample site running DruCall at

   http://www.drucall.org/drucall

How to install DruCall
----------------------

a) set up a TURN server, e.g. use the one of these packages
   on Debian or Ubuntu:

     resiprocate-turn-server
         http://packages.debian.org/wheezy/resiprocate-turn-server

     rfc5766-turn-server
         http://packages.debian.org/sid/rfc5766-turn-server
        
     turnserver
         http://packages.debian.org/sid/turnserver

b) set up a SIP Proxy or PBX supporting SIP over WebSockets / WebRTC,
   for example:

     http://www.resiprocate.org/WebRTC_and_SIP_Over_WebSockets

     http://sip-router.org/docbook/sip-router/branch/master/modules/websocket/websocket.html

c) set up a user to receive calls, for example, using one of the online
   configurable SIP WebRTC demo apps:

     http://tryit.jssip.net/

   or install one of these apps to your own server (e.g. the Debian package
   jscommunicator-web-phone), and then go to
       http://your-server/jscommunicator-web-phone
   and log in to your SIP proxy.

d) unpack the modules:

    DruCall module into your Drupal 7 modules directory
    libraries API into your Drupal 7 modules directory

    Install the JsSIP and JSCommunicator modules from these two sites:

    https://github.com/opentelecoms-org/drupal-mod-jscommunicator/releases

    https://github.com/opentelecoms-org/drupal-mod-jssip

    and follow their instructions to install the JavaScript files themselves.

    To save time, you can do all of the above using the Debian packages:

       apt-get install drupal7-mod-jscommunicator

    For details, see:

    http://danielpocock.com/debian-solving-drupal-third-party-library-distribution

e) go to the Administration / Configuration / DruCall / Settings panel,

     http://your-drupal-site/admin/config/drucall/settings

f) set up all the necessary settings for your SIP Proxy/server and user

g) now go to
 
     http://your-drupal-site/drucall

   Click one of the buttons and make a call - easy


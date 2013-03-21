

Background
----------

You need a modern web browser, e.g. Google Chrome 25 or FireFox nightly builds

Ericsson Bowser for Android is another possible browser.

Sample site
-----------

You can see a sample site running DruCall at

   http://www.opentelecoms.org/drucall

How to install DruCall
----------------------

a) set up a TURN server, e.g. use the one of these packages
   on Debian or Ubuntu:

     resiprocate-turn-server
         http://packages.debian.org/wheezy/resiprocate-turn-server
        
     turnserver
         http://packages.debian.org/sid/turnserver

b) set up a SIP Proxy or PBX supporting SIP over WebSockets / WebRTC,
   for example:

     http://www.resiprocate.org/WebRTC_and_SIP_Over_WebSockets

     http://sip-router.org/docbook/sip-router/branch/master/modules/websocket/websocket.html

c) set up a user to receive calls, for example, using one of the online
   configurable SIP WebRTC demo apps:

     http://sipml5.org/call.htm

     http://tryit.jssip.net/

   or install one of these apps to your own server (e.g. the Debian package
   sipml5-web-phone), and then go to http://your-server/sipml5-web-phone

d) unpack the modules:

    DruCall module into your Drupal 7 modules directory
    libraries API into your Drupal 7 modules directory
    mkdir (drupal)sites/all/libraries/sipml5/release

    Download SIPml5-api.js into (drupal)sites/all/libraries/sipml5/release
     (from http://sipml5.org)

    echo "1.0.0" > (drupal)sites/all/libraries/sipml5/VERSION

e) go to the Administration / Configuration / DruCall / Settings panel,

     http://your-drupal-site/admin/config/drucall/settings

f) set up all the necessary settings for your SIP Proxy/server and user

g) now go to
 
     http://your-drupal-site/drucall

   Click one of the buttons and make a call - easy


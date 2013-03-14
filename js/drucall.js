
    // to avoid caching
    //if (window.location.href.indexOf("svn=") == -1) {
    //    window.location.href += (window.location.href.indexOf("?") == -1 ? "?svn=13" : "&svn=13");
    //}

    var sTransferNumber;
    var oRingTone, oRingbackTone;
    var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;
    var btnCallAudio, btnCall, btnHangUp;
    var txtRegStatus, txtCallStatus;
    var btnFullScreen, btnHoldResume, btnTransfer, btnKeyPad;
    var videoRemote, videoLocal, audioRemote;
    var divVideo, divCallOptions;
    var tdVideo;
    var bFullScreen = false;
    var oNotifICall;
    var oReadyStateTimer;
    var bDisableVideo = false;
    var viewVideoLocal, viewVideoRemote; // <video> (webrtc) or <div> (webrtc4all)

    window.onload = function () {
        do_setup();
    }

    function do_setup() {

        btnCallAudio = document.getElementById("btnCallAudio");
        btnCall = document.getElementById("btnCall");
        btnHangUp = document.getElementById("btnHangUp");

        txtRegStatus = document.getElementById("txtRegStatus");
        txtCallStatus = document.getElementById("txtCallStatus");

        btnFullScreen = document.getElementById("btnFullScreen");
        btnHoldResume = document.getElementById("btnHoldResume");
        btnTransfer = document.getElementById("btnTransfer");
        btnKeyPad = document.getElementById("btnKeyPad");

        videoLocal = document.getElementById("video_local");
        videoRemote = document.getElementById("video_remote");

        audioRemote = document.getElementById("audio_remote");

        divVideo = document.getElementById("divVideo");
        divCallOptions = document.getElementById("divCallOptions");
        //divVideo.style.height = '0px';

        tdVideo = document.getElementById("tdVideo");

        document.onkeyup = onKeyUp;
        document.body.onkeyup = onKeyUp;
        document.getElementById("divCallCtrl").onmousemove = onDivCallCtrlMouseMove;

        oReadyStateTimer = setInterval(function () {
            if (document.readyState === "complete") {
                clearInterval(oReadyStateTimer);
                // initialize SIPML5
                SIPml.init(postInit);
            }
        },
        500);
    };

    function postInit() {
        // check webrtc4all version
        if (SIPml.isWebRtc4AllSupported() && SIPml.isWebRtc4AllPluginOutdated()) {            
            if (confirm("Your WebRtc4all extension is outdated. A new version with critical bug fix is available. Do you want to install it?\nIMPORTANT: You must restart your browser after the installation.")) {
                window.location = 'http://code.google.com/p/webrtc4all/downloads/list';
                return;
            }
        }

        // check for WebRTC support
        if (!SIPml.isWebRtcSupported()) {
            // is it chrome?
            if (SIPml.getNavigatorFriendlyName() == 'chrome') {
                    if (confirm("You're using an old Chrome version or WebRTC is not enabled.\nDo you want to see how to enable WebRTC?")) {
                        window.location = 'http://www.webrtc.org/running-the-demos';
                    }
                    else {
                        window.location = "index.html";
                    }
                    return;
            }
                
            // for now the plugins (WebRTC4all only works on Windows)
            if (SIPml.getSystemFriendlyName() == 'windows') {
                // Internet explorer
                if (SIPml.getNavigatorFriendlyName() == 'ie') {
                    // Check for IE version 
                    if (parseFloat(SIPml.getNavigatorVersion()) < 9.0) {
                        if (confirm("You are using an old IE version. You need at least version 9. Would you like to update IE?")) {
                            window.location = 'http://windows.microsoft.com/en-us/internet-explorer/products/ie/home';
                        }
                        else {
                            window.location = "index.html";
                        }
                    }

                    // check for WebRTC4all extension
                    if (!SIPml.isWebRtc4AllSupported()) {
                        if (confirm("webrtc4all extension is not installed. Do you want to install it?\nIMPORTANT: You must restart your browser after the installation.")) {
                            window.location = 'http://code.google.com/p/webrtc4all/downloads/list';
                        }
                        else {
                            // Must do nothing: give the user the chance to accept the extension
                            // window.location = "index.html";
                        }
                    }
                    // break page loading ('window.location' won't stop JS execution)
                    if (!SIPml.isWebRtc4AllSupported()) {
                        return;
                    }
                }
                else if (SIPml.getNavigatorFriendlyName() == "safari" || SIPml.getNavigatorFriendlyName() == "firefox" || SIPml.getNavigatorFriendlyName() == "opera") {
                    if (confirm("Your browser don't support WebRTC.\nDo you want to install WebRTC4all extension to enjoy audio/video calls?\nIMPORTANT: You must restart your browser after the installation.")) {
                        window.location = 'http://code.google.com/p/webrtc4all/downloads/list';
                    }
                    else {
                        window.location = "index.html";
                    }
                    return;
                }
            }
            // OSX, Unix, Android, iOS...
            else {
                if (confirm('WebRTC not supported on your browser.\nDo you want to download a WebRTC-capable browser?')) {
                    window.location = 'https://www.google.com/intl/en/chrome/browser/';
                }
                else {
                    window.location = "index.html";
                }
                return;
            }
        }

        // checks for WebSocket support
        if (!SIPml.isWebSocketSupported() && !SIPml.isWebRtc4AllSupported()) {
            if (confirm('Your browser don\'t support WebSockets.\nDo you want to download a WebSocket-capable browser?')) {
                window.location = 'https://www.google.com/intl/en/chrome/browser/';
            }
            else {
                window.location = "index.html";
            }
            return;
        }

        // FIXME: displays must be per session

        // attachs video displays
        if (SIPml.isWebRtc4AllSupported()) {
            tsk_utils_log_info('== using WebRTC4All plugin');
            viewVideoLocal = document.getElementById("divVideoLocal");
            viewVideoRemote = document.getElementById("divVideoRemote");
            WebRtc4all_SetDisplays(viewVideoLocal, viewVideoRemote); // FIXME: move to SIPml.* API
        }
        else{
            tsk_utils_log_info('== using WebRTC in browser');
            viewVideoLocal = videoLocal;
            viewVideoRemote = videoRemote;
        }

        if (!SIPml.isWebRtc4AllSupported() && !SIPml.isWebRtcSupported()) {
            if (confirm('Your browser don\'t support WebRTC.\naudio/video calls will be disabled.\nDo you want to download a WebRTC-capable browser?')) {
                window.location = 'https://www.google.com/intl/en/chrome/browser/';
            }
        }

        document.body.style.cursor = 'default';

        sipRegister();
    }


    function sipRegister() {
        // catch exception for IE (DOM not ready)
        try {
            var my_settings = Drupal.settings.drucall;
            var o_impu = tsip_uri.prototype.Parse(my_settings.impu);
            if (!o_impu || !o_impu.s_user_name || !o_impu.s_host) {
                txtRegStatus.innerHTML = "<b>[" + txtPublicIdentity.value + "] is not a valid Public identity</b>";
                return;
            }

            // enable notifications if not already done
            if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
                window.webkitNotifications.requestPermission();
            }

            var my_ice_servers = '[{url:\'' + my_settings.turn_server_url + '\',credential:\'' + my_settings.turn_password + '\'}]';

            // create SIP stack
            oSipStack = new SIPml.Stack({
                    realm: my_settings.realm,
                    impi: my_settings.impi,
                    impu: my_settings.impu,
                    password: my_settings.password,
                    display_name: my_settings.display_name,
                    websocket_proxy_url: my_settings.websocket_server_url,
                    outbound_proxy_url: my_settings.sip_outboundproxy_url,
                    ice_servers: my_ice_servers,
                    enable_rtcweb_breaker: false,
                    events_listener: { events: '*', listener: onSipEventStack },
                    sip_headers: [
                            { name: 'User-Agent', value: 'IM-client/OMA1.0 DruCall-v1.2013.02.21' },
                            { name: 'Organization', value: 'OpenTelecoms.org' }
                    ]
                }
            );
            if (oSipStack.start() != 0) {
                txtRegStatus.innerHTML = '<b>Failed to start the SIP stack</b>';
            }
            else return;
        }
        catch (e) {
            txtRegStatus.innerHTML = "<b>2:" + e + "</b>";
        }
    }

    // sends SIP REGISTER (expires=0) to logout
    function sipUnRegister() {
        if (oSipStack) {
            oSipStack.stop(); // shutdown all sessions
        }
    }

    function activateButtonCall(do_activate) {
        btnCallAudio.disabled = !do_activate;
        btnCall.disabled = !do_activate;
    }

    // makes a call (SIP INVITE)
    function sipCall(useVideo) {
        var my_settings = Drupal.settings.drucall;
        // call configuration
        var oConf = {
            audio_remote: audioRemote,
            video_local: viewVideoLocal,
            video_remote: viewVideoRemote,
            events_listener: { events: '*', listener: onSipEventSession },
            sip_caps: [
                            { name: '+g.oma.sip-im' },
                            { name: '+sip.ice' },
                            { name: 'language', value: '\"en,fr\"' }
                        ]
        };
        if (oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(my_settings.phone_number)) {
            activateButtonCall(false);
            btnHangUp.disabled = false;

            // check whether video is disabled or not
            bDisableVideo = !useVideo;
            // create call session
            oSipSessionCall = oSipStack.newSession(bDisableVideo ? 'call-audio' : 'call-audiovideo', oConf);
            // make call
            if (oSipSessionCall.call(my_settings.phone_number) != 0) {
                oSipSessionCall = null;
                txtCallStatus.value = 'Failed to make call';
                activateButtonCall(true);
                btnHangUp.disabled = true;
                return;
            }
        }
        else if (oSipSessionCall) {
            txtCallStatus.innerHTML = '<i>Connecting...</i>';
            oSipSessionCall.accept(oConf);
        }
    }

    // transfers the call
    function sipTransfer() {
        if (oSipSessionCall) {
            var s_destination = prompt('Enter destination number', '');
            if (!tsk_string_is_null_or_empty(s_destination)) {
                btnTransfer.disabled = true;
                if (oSipSessionCall.transfer(s_destination) != 0) {
                    txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                    btnTransfer.disabled = false;
                    return;
                }
                txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
            }
        }
    }
    
    // holds or resumes the call
    function sipToggleHoldResume() {
        if (oSipSessionCall) {
            var i_ret;
            btnHoldResume.disabled = true;
            txtCallStatus.innerHTML = oSipSessionCall.bHeld ? '<i>Resuming the call...</i>' : '<i>Holding the call...</i>';
            i_ret = oSipSessionCall.bHeld ? oSipSessionCall.resume() : oSipSessionCall.hold();
            if (i_ret != 0) {
                txtCallStatus.innerHTML = '<i>Hold / Resume failed</i>';
                btnHoldResume.disabled = false;
                return;
            }
        }
    }

    // terminates the call (SIP BYE or CANCEL)
    function sipHangUp() {
        if (oSipSessionCall) {
            txtCallStatus.innerHTML = '<i>Terminating the call...</i>';
            oSipSessionCall.hangup({events_listener: { events: '*', listener: onSipEventSession }});
        }
    }

    function startRingTone() {
        try { ringtone.play(); }
        catch (e) { }
    }

    function stopRingTone() {
        try { ringtone.pause(); }
        catch (e) { }
    }

    function startRingbackTone() {
        try { ringbacktone.play(); }
        catch (e) { }
    }

    function stopRingbackTone() {
        try { ringbacktone.pause(); }
        catch (e) { }
    }

    function toggleFullScreen() {
        if (videoRemote.webkitSupportsFullscreen) {
            fullScreen(!videoRemote.webkitDisplayingFullscreen);
        }
        else {
            fullScreen(!bFullScreen);
        }
    }

    function fullScreen(b_fs) {
        bFullScreen = b_fs;
        if (tsk_utils_have_webrtc4native() && bFullScreen && videoRemote.webkitSupportsFullscreen) {
            if (bFullScreen) {
                videoRemote.webkitEnterFullScreen();
            }
            else {
                videoRemote.webkitExitFullscreen();
            }
        }
        else {
            if (tsk_utils_have_webrtc4npapi()) {
                try { __o_display_remote.setFullScreen(b_fs); }
                catch (e) { divVideo.setAttribute("class", b_fs ? "full-screen" : "normal-screen"); }
            }
            else {
                divVideo.setAttribute("class", b_fs ? "full-screen" : "normal-screen");
            }
        }
    }

    function showNotifICall(s_number) {
        // permission already asked when we registered
        if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
            if (oNotifICall) {
                oNotifICall.cancel();
            }
            oNotifICall = window.webkitNotifications.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number);
            oNotifICall.onclose = function () { oNotifICall = null; };
            oNotifICall.show();
        }
    }

    function onKeyUp(evt) {
        evt = (evt || window.event);
        if (evt.keyCode == 27) {
            fullScreen(false);
        }
        else if (evt.ctrlKey && evt.shiftKey) { // CTRL + SHIFT
            if (evt.keyCode == 65 || evt.keyCode == 86) { // A (65) or V (86)
                bDisableVideo = (evt.keyCode == 65);
                txtCallStatus.innerHTML = '<i>Video ' + (bDisableVideo ? 'disabled' : 'enabled') + '</i>';
                window.localStorage.setItem('org.doubango.expert.disable_video', bDisableVideo);
            }
        }
    }

    function onDivCallCtrlMouseMove(evt) {
        try { // IE: DOM not ready
            if (tsk_utils_have_stream()) {
                activateButtonCall(!(!tsk_utils_have_stream() || !oSipSessionRegister || !oSipSessionRegister.is_connected()));
                document.getElementById("divCallCtrl").onmousemove = null; // unsubscribe
            }
        }
        catch (e) { }
    }

    function uiOnConnectionEvent(b_connected, b_connecting) { // should be enum: connecting, connected, terminating, terminated
        activateButtonCall(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
        btnHangUp.disabled = !oSipSessionCall;
    }

    function uiVideoDisplayEvent(b_local, b_added) {
        //if (!bDisableVideo) {
            var o_elt_video = b_local ? videoLocal : videoRemote;

            if (b_added) {
                if (SIPml.isWebRtc4AllSupported()) {
                    if (b_local) __o_display_local.style.visibility = "visible";
                    else __o_display_remote.style.visibility = "visible";
                   
                }
                else {
                    o_elt_video.style.opacity = 1;
                }
                uiVideoDisplayShowHide(true);
            }
            else {
                if (SIPml.isWebRtc4AllSupported()) {
                    if (b_local) __o_display_local.style.visibility = "hidden";
                    else __o_display_remote.style.visibility = "hidden";
                }
                else{
                    o_elt_video.style.opacity = 0;
                }
                fullScreen(false);
            }
        //}
    }

    function uiVideoDisplayShowHide(b_show) {
        if (b_show) {
            tdVideo.style.height = '340px';
            divVideo.style.height = navigator.appName == 'Microsoft Internet Explorer' ? '100%' : '340px';
        }
        else {
            tdVideo.style.height = '0px';
            divVideo.style.height = '0px';
        }
        btnFullScreen.disabled = !b_show;
    }

    function uiCallTerminated(s_description){
        btnCallAudio.value = 'Call (audio only)';
        btnCall.value = 'Call (with video)';
        btnHangUp.value = 'HangUp';
        btnHoldResume.value = 'hold';
        activateButtonCall(true);
        btnHangUp.disabled = true;

        oSipSessionCall = null;

        stopRingbackTone();
        stopRingTone();

        txtCallStatus.innerHTML = "<i>" + s_description + "</i>";
        uiVideoDisplayShowHide(false);
        divCallOptions.style.opacity = 0;

        if (oNotifICall) {
            oNotifICall.cancel();
            oNotifICall = null;
        }

        uiVideoDisplayEvent(true, false);
        uiVideoDisplayEvent(false, false);

        setTimeout(function () { if (!oSipSessionCall) txtCallStatus.innerHTML = ''; }, 2500);
    }

    // Callback function for SIP Stacks
    function onSipEventStack(e /*SIPml.Stack.Event*/) {
        tsk_utils_log_info('==stack event = ' + e.type);
        switch (e.type) {
            case 'started':
                {
                    // catch exception for IE (DOM not ready)
                    try {
                        // LogIn (REGISTER) as soon as the stack finish starting
                        oSipSessionRegister = this.newSession('register', {
                            expires: 200,
                            events_listener: { events: '*', listener: onSipEventSession },
                            sip_caps: [
                                        { name: '+g.oma.sip-im', value: null },
                                        { name: '+audio', value: null },
                                        { name: 'language', value: '\"en,fr\"' }
                                ]
                        });
                        oSipSessionRegister.register();
                    }
                    catch (e) {
                        txtRegStatus.value = txtRegStatus.innerHTML = "<b>1:" + e + "</b>";
                    }
                    break;
                }
            case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
                {
                    var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
                    oSipStack = null;
                    oSipSessionRegister = null;
                    oSipSessionCall = null;

                    uiOnConnectionEvent(false, false);

                    stopRingbackTone();
                    stopRingTone();

                    uiVideoDisplayShowHide(false);
                    divCallOptions.style.opacity = 0;

                    txtCallStatus.innerHTML = '';
                    txtRegStatus.innerHTML = bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
                    break;
                }

            case 'i_new_call':
                {
                    if (oSipSessionCall) {
                        // do not accept the incoming call if we're already 'in call'
                        e.newSession.hangup(); // comment this line for multi-line support
                    }
                    else {
                        oSipSessionCall = e.newSession;

                        btnCallAudio.value = 'Answer (audio only)';
                        btnCall.value = 'Answer (with video)';
                        btnHangUp.value = 'Reject';
                        activateButtonCall(true);
                        btnHangUp.disabled = false;

                        startRingTone();

                        var sRemoteNumber = (oSipSessionCall.getRemoteFriendlyName() || 'unknown');
                        txtCallStatus.innerHTML = "<i>Incoming call from [<b>" + sRemoteNumber + "</b>]</i>";
                        showNotifICall(sRemoteNumber);
                    }
                    break;
                }

            case 'm_permission_requested':
                {
                    //document.getElementById('divNavbarInner').setAttribute('class', 'navbar-inner-red');
                    break;
                }
            case 'm_permission_accepted':
            case 'm_permission_refused':
                {
                    //document.getElementById('divNavbarInner').setAttribute('class', 'navbar-inner');
                    if(e.type == 'm_permission_refused'){
                        uiCallTerminated('Media stream permission denied');
                    }
                    break;
                }

            case 'starting': default: break;
        }
    };

    // Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
    function onSipEventSession(e /* SIPml.Session.Event */) {
        if (window.console) window.console.info('==session event = ' + e.type);

        switch (e.type) {
            case 'connecting': case 'connected':
                {
                    var bConnected = (e.type == 'connected');
                    if (e.session == oSipSessionRegister) {
                        uiOnConnectionEvent(bConnected, !bConnected);
                        txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    }
                    else if (e.session == oSipSessionCall) {
                        btnHangUp.value = 'HangUp';
                        activateButtonCall(false);
                        btnHangUp.disabled = false;
                        btnTransfer.disabled = false;

                        if (bConnected) {
                            stopRingbackTone();
                            stopRingTone();

                            if (oNotifICall) {
                                oNotifICall.cancel();
                                oNotifICall = null;
                            }
                        }

                        txtCallStatus.innerHTML = "<i>" + e.description + "</i>";
                        divCallOptions.style.opacity = bConnected ? 1 : 0;

                        if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
                            uiVideoDisplayEvent(true, true);
                            uiVideoDisplayEvent(false, true);
                        }
                    }
                    break;
                } // 'connecting' | 'connected'
            case 'terminating': case 'terminated':
                {
                    if (e.session == oSipSessionRegister) {
                        uiOnConnectionEvent(false, false);

                        oSipSessionCall = null;
                        oSipSessionRegister = null;

                        txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
                    }
                    else if (e.session == oSipSessionCall) {
                        uiCallTerminated(e.description);
                    }
                    break;
                } // 'terminating' | 'terminated'

            case 'm_stream_video_local_added':
                {
                    if (e.session == oSipSessionCall) {
                        tsk_utils_log_info('==stack event = adding local video');
                        uiVideoDisplayEvent(true, true);
                    }
                    break;
                }
            case 'm_stream_video_local_removed':
                {
                    if (e.session == oSipSessionCall) {
                        uiVideoDisplayEvent(true, false);
                    }
                    break;
                }
            case 'm_stream_video_remote_added':
                {
                    if (e.session == oSipSessionCall) {
                        tsk_utils_log_info('==stack event = adding remote video');
                        uiVideoDisplayEvent(false, true);
                    }
                    break;
                }
            case 'm_stream_video_remote_removed':
                {
                    if (e.session == oSipSessionCall) {
                        uiVideoDisplayEvent(false, false);
                    }
                    break;
                }

            case 'm_stream_audio_local_added':
            case 'm_stream_audio_local_removed':
            case 'm_stream_audio_remote_added':
            case 'm_stream_audio_remote_removed':
                {
                    break;
                }

            case 'i_ect_new_call':
                {
                    oSipSessionTransferCall = e.session;
                    break;
                }

            case 'i_ao_request':
                {
                    if(e.session == oSipSessionCall){
                        var iSipResponseCode = e.getSipResponseCode();
                        if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                            startRingbackTone();
                            txtCallStatus.innerHTML = '<i>Remote ringing...</i>';
                        }
                    }
                    break;
                }

            case 'm_early_media':
                {
                    if(e.session == oSipSessionCall){
                        stopRingbackTone();
                        stopRingTone();
                        txtCallStatus.innerHTML = '<i>Early media started</i>';
                    }
                    break;
                }

            case 'm_local_hold_ok':
                {
                    if(e.session == oSipSessionCall){
                        if (oSipSessionCall.bTransfering) {
                            oSipSessionCall.bTransfering = false;
                            // this.AVSession.TransferCall(this.transferUri);
                        }
                        btnHoldResume.value = 'Resume';
                        btnHoldResume.disabled = false;
                        txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
                        oSipSessionCall.bHeld = true;
                    }
                    break;
                }
            case 'm_local_hold_nok':
                {
                    if(e.session == oSipSessionCall){
                        oSipSessionCall.bTransfering = false;
                        btnHoldResume.value = 'Hold';
                        btnHoldResume.disabled = false;
                        txtCallStatus.innerHTML = '<i>Failed to place remote party on hold</i>';
                    }
                    break;
                }
            case 'm_local_resume_ok':
                {
                    if(e.session == oSipSessionCall){
                        oSipSessionCall.bTransfering = false;
                        btnHoldResume.value = 'Hold';
                        btnHoldResume.disabled = false;
                        txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
                        oSipSessionCall.bHeld = false;

                        if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
                            uiVideoDisplayEvent(true, true);
                            uiVideoDisplayEvent(false, true);
                        }
                    }
                    break;
                }
            case 'm_local_resume_nok':
                {
                    if(e.session == oSipSessionCall){
                        oSipSessionCall.bTransfering = false;
                        btnHoldResume.disabled = false;
                        txtCallStatus.innerHTML = '<i>Failed to unhold call</i>';
                    }
                    break;
                }
            case 'm_remote_hold':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Placed on hold by remote party</i>';
                    }
                    break;
                }
            case 'm_remote_resume':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Taken off hold by remote party</i>';
                    }
                    break;
                }

            case 'o_ect_trying':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Call transfer in progress...</i>';
                    }
                    break;
                }
            case 'o_ect_accepted':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Call transfer accepted</i>';
                    }
                    break;
                }
            case 'o_ect_completed':
            case 'i_ect_completed':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Call transfer completed</i>';
                        btnTransfer.disabled = false;
                        if (oSipSessionTransferCall) {
                            oSipSessionCall = oSipSessionTransferCall;
                        }
                        oSipSessionTransferCall = null;
                    }
                    break;
                }
            case 'o_ect_failed':
            case 'i_ect_failed':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
                        btnTransfer.disabled = false;
                    }
                    break;
                }
            case 'o_ect_notify':
            case 'i_ect_notify':
                {
                    if(e.session == oSipSessionCall){
                        txtCallStatus.innerHTML = "<i>Call Transfer: <b>" + e.getSipResponseCode() + " " + e.description + "</b></i>";
                        if (e.getSipResponseCode() >= 300) {
                            if (oSipSessionCall.bHeld) {
                                oSipSessionCall.resume();
                            }
                            btnTransfer.disabled = false;
                        }
                    }
                    break;
                }
            case 'i_ect_requested':
                {
                    if(e.session == oSipSessionCall){                        
                        var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?";//FIXME
                        if (confirm(s_message)) {
                            txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
                            oSipSessionCall.acceptTransfer();
                            break;
                        }
                        oSipSessionCall.rejectTransfer();
                    }
                    break;
                }
        }
    }

(function ($) {

    Drupal.behaviors.drucall = {
      attach: function(context, settings)
      {
            do_setup();
      }
    };
})(jQuery, Drupal);

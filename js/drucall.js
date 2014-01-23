

(function ($) {

    Drupal.behaviors.drucall = {
      attach: function(context, settings)
      {

            var dcsettings = settings.drucall;

            window.JSCommSettings = {

  // Web server environment
  webserver: {
    url_prefix: '/' + dcsettings.mod_path + '/'  // If set, prefix used to construct sound/ URLs
  },

  // STUN/TURN media relays
  stun_servers: [],
  turn_servers: [
    { server: dcsettings.turn_server_url, username:dcsettings.turn_username, password:dcsettings.turn_password }
  ],

  // WebSocket connection
  websocket: {
    servers: dcsettings.websocket_server_url,
    connection_recovery_min_interval: 2,
    connection_recovery_max_interval: 30,
  },

  // User identity
  user: {
    display_name: dcsettings.display_name,
    uri: dcsettings.impu,
    sip_auth_user: dcsettings.impi,
    sip_auth_password: dcsettings.password,
    sip_auth_user_full_uri: false,
  },

  // User SIP registration
  registration : {
    on_startup: false,          // Register when websocket link starts?
    expiry: 3600,              // Registration expiry (seconds)
    user_control: false,        // Show button for user to (de)register
    server: null,              // Registration server
  },

  dialing : {
    auto_dial : {
      default_destination : dcsettings.phone_number,  // A name or full URI
      on_startup: false,           // Whether to wait for user to click dial
      use_video: false,            // Whether to auto-dial with video
    },
    edit_destination: true,      // Whether the user may edit the destination
    show_destination: true,      // Whether the user can see the destination
    audio_dialing: dcsettings.enable_audio,         // Whether to offer an audio call button
    video_dialing: dcsettings.enable_video,         // Whether to offer a video call button
    prefer_video: false,         // If user presses Enter to dial, use video?
    no_answer_timeout: 60,       // How long to wait for answer (seconds)
  },

  session : {
    show_dtmf_pad : false,        // Whether to show a DTMF dialpad during calls
  },


};

            JSCommManager.init();
      }
    };
})(jQuery, Drupal);

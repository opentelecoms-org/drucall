<div id="divCallCtrl" >

<table>
  <tr><td>Server status:</td><td><label id="txtRegStatus"></label></td></tr>
  <tr><td>Call status:</td><td><label id="txtCallStatus"></label></td></tr>
</table>

  <br/>
  <p>DruCall is the <a href="http://www.webrtc.org">WebRTC</a> calling module for <a href="http://www.drupal.org">Drupal</a></p>

  <p>To call me, you simply need to have a recent web browser.  This has been tested with <a href="https://www.google.com/intl/en/chrome/browser/beta.html">Google Chrome 25</a>
   and should also work with <a href="http://nightly.mozilla.org/">Firefox nightly builds</a> and <a href="https://labs.ericsson.com/apps/bowser">Bowser (From Ericsson Labs)</a> on Android</p>

  <p>If your browser is capable of <a href="http://www.webrtc.org">WebRTC</a> calling, you simply need to click the <b>Call</b>
    button below to initiate a call.</p>
  <br/>

</div>

                <table style='width: 100%;'>
                    <tr>
                        <td colspan="1" align="right">

                            <input type="button" class="btn-primary" style="" id="btnCallAudio" value="Call (audio only)" onclick='sipCall(false);' disabled /> &nbsp;
                            <input type="button" class="btn-primary" style="" id="btnCall" value="Call (with video)" onclick='sipCall(true);' disabled /> &nbsp;
                            <input type="button" class="btn-primary" style="" id="btnHangUp" value="HangUp" onclick='sipHangUp();' disabled />
                        </td>
                    </tr>
                    <tr>
                        <td id="tdVideo" class='tab-video'>
                            <div id="divVideo" class='div-video'>
                                <div id="divVideoRemote" style='border:1px solid #000; height:100%; width:100%';>
                                    <video class="video" width="100%" height="100%" id="video_remote" autoplay="autoplay" style="opacity: 0; background-color: #000000; -webkit-transition-property: opacity; -webkit-transition-duration: 2s;">
                                    </video>
                                </div>
                                <div id="divVideoLocal" style='border:0px solid #000'>
                                    <video class="video" width="88px" height="72px" id="video_local" autoplay="autoplay" style="opacity: 0; margin-top: -80px; margin-left: 5px; background-color: #000000; -webkit-transition-property: opacity; -webkit-transition-duration: 2s;">
                                    </video>
                                </div>
                            </div>
                        </td>

                    </tr>
                    <tr>
                       <td align='center'>
                            <div id='divCallOptions' class='call-options' style='opacity: 0; margin-top: 3px'>
                                <input type="button" class="btn" style="" id="btnFullScreen" value="FullScreen" disabled onclick='toggleFullScreen();' /> &nbsp;
                                <input type="button" class="btn" style="" id="btnHoldResume" value="Hold" onclick='sipToggleHoldResume();' /> &nbsp;
                                <input type="button" class="btn" style="" id="btnTransfer" value="Transfer" onclick='sipTransfer();' /> &nbsp;

                                <!--input type="button" class="btn" style="" id="btnKeyPad" value="KeyPad" onclick='toto();' /-->
                            </div>
                        </td>
                    </tr>
                </table>
</div>

<!-- Audios -->
<?PHP $drucall_prefix = drupal_get_path('module', 'drucall');?>
<audio id="audio_remote" autoplay="autoplay" />
<audio id="ringtone" loop src="/<?=$drucall_prefix?>/sounds/ringtone.wav" />
<audio id="ringbacktone" loop src="/<?=$drucall_prefix?>/sounds/ringbacktone.wav" />

<div>
  <br/>
  <label style="width: 100%;" align="center" id="txtRegStatus"></label>

  <br/>
  <p>DruCall is the <a href="http://www.webrtc.org">WebRTC</a> calling module for <a href="http://www.drupcal.org">Drupal</a></p>

 
</div>


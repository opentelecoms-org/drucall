<?php

/**
 * @file
 * Admin page callbacks for the DruCall module.
 */

/**
 * Form for configuring DruCall settings.
 */
function drucall_admin($form, &$form_state) {

  $form['default_destination'] = array(
    '#type' => 'textfield',
    '#title' => t('Default destination'),
    '#default_value' => variable_get('default_destination', 'operator'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The default destination that should be dialed when a visitor makes a DruCall call.  Can be the user part of a URI, or a full sip: URI.'),
  );

  $form['display_name'] = array(
    '#type' => 'textfield',
    '#title' => t('Display name for caller'),
    '#default_value' => variable_get('display_name', 'DruCall user'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The display name to be inserted in the From: header of a call made by a DruCall user.  Future versions of DruCall may detect the logged in user name.'),
  );

  $form['from_uri'] = array(
    '#type' => 'textfield',
    '#title' => t('SIP User ID (For From: header)'),
    '#default_value' => variable_get('from_uri', 'sip:user@example.org'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The SIP URI, including the sip: scheme prefix, for the DruCall users'),
  );

  $form['auth_user'] = array(
    '#type' => 'textfield',
    '#title' => t('Authentication username'),
    '#default_value' => variable_get('auth_user', 'username'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The username for authenticating to the SIP proxy.'),
  );

  $form['auth_password'] = array(
    '#type' => 'textfield',
    '#title' => t('Authentication password'),
    '#default_value' => variable_get('auth_password', ''),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The password for authenticating to the SIP proxy.'),
  );

  $form['auth_realm'] = array(
    '#type' => 'textfield',
    '#title' => t('Authentication realm'),
    '#default_value' => variable_get('auth_realm', 'realm'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The realm for authenticating to the SIP proxy.'),
  );

  $form['websocket_server_url'] = array(
    '#type' => 'textfield',
    '#title' => t('WebSocket Server URL'),
    '#default_value' => variable_get('websocket_server_url', 'ws://sip-proxy.example.org:80'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The WebSocket URL of the SIP proxy, typically with the ws: or wss: prefix.'),
  );

  $form['sip_outboundproxy_url'] = array(
    '#type' => 'textfield',
    '#title' => t('SIP Outbound Proxy URL'),
    '#default_value' => variable_get('sip_outboundproxy_url', 'tcp://sip-proxy.example.org:5060'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The Outbound Proxy URL.'),
  );

  $form['turn_server_url'] = array(
    '#type' => 'textfield',
    '#title' => t('STUN/TURN server URL'),
    '#default_value' => variable_get('turn_server_url', 'turn:user@turn-server.example.org'),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The URL of the TURN server, for example, turn:user@turn-server.example.org.'),
  );

  $form['turn_password'] = array(
    '#type' => 'textfield',
    '#title' => t('TURN server password'),
    '#default_value' => variable_get('turn_password', ''),
    '#cols' => 40,
    '#rows' => 1,
    '#description' => t('The password (long-term credential) for authenticating to the TURN server.'),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save Settings'),
  );

  return $form;

}

/**
 * Submit hook for drucall_admin.
 */
function drucall_admin_submit($form, &$form_state) {

  variable_set('default_destination', $form_state['values']['default_destination']);
  variable_set('display_name', $form_state['values']['display_name']);
  variable_set('from_uri', $form_state['values']['from_uri']);
  variable_set('auth_user', $form_state['values']['auth_user']);
  variable_set('auth_password', $form_state['values']['auth_password']);
  variable_set('auth_realm', $form_state['values']['auth_realm']);
  variable_set('websocket_server_url', $form_state['values']['websocket_server_url']);
  variable_set('sip_outboundproxy_url', $form_state['values']['sip_outboundproxy_url']);
  variable_set('turn_server_url', $form_state['values']['turn_server_url']);
  variable_set('turn_password', $form_state['values']['turn_password']);

  drupal_set_message(t('Your settings have been saved.'));

}


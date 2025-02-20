#!/usr/bin/env python

#-----------------------------------------------------------------------
# auth2.py
# Author: Bob Dondero
#   With lots of help from https://realpython.com/flask-google-login/
#-----------------------------------------------------------------------

import os
import sys
import json
import requests
import flask
import oauthlib.oauth2
import dotenv

#-----------------------------------------------------------------------

# Allow HTTP for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

GOOGLE_DISCOVERY_URL = (
    'https://accounts.google.com/.well-known/openid-configuration')

dotenv.load_dotenv()
GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = os.environ['GOOGLE_CLIENT_SECRET']

# Get the base URL from CORS_ORIGINS, using the first origin
cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:5000").split(',')
BASE_URL = cors_origins[0].rstrip('/')  # Remove trailing slash if present

# Debug logging
print("Environment CORS_ORIGINS:", os.environ.get("CORS_ORIGINS"), file=sys.stderr)
print("All origins:", cors_origins, file=sys.stderr)
print("Selected BASE_URL:", BASE_URL, file=sys.stderr)

client = oauthlib.oauth2.WebApplicationClient(GOOGLE_CLIENT_ID)

#-----------------------------------------------------------------------

def login():

    # Determine the URL for Google login.
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    authorization_endpoint = (
        google_provider_cfg['authorization_endpoint'])

    # Use BASE_URL for the redirect URI
    redirect_uri = f"{BASE_URL}/login/callback"
    print("Login redirect_uri:", redirect_uri, file=sys.stderr)
    
    # Construct the request URL for Google login, providing scopes
    # to fetch the user's profile data.
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=['openid', 'email', 'profile'],
    )

    print("Final request_uri:", request_uri, file=sys.stderr)
    # Redirect to the request URL.
    return flask.redirect(request_uri)

#-----------------------------------------------------------------------

def callback():
    try:
        # Get the authorization code that Google sent.
        code = flask.request.args.get('code')
        if not code:
            return None, "Authorization code missing"

        # Force HTTPS for the request URL in production
        request_url = flask.request.url
        if os.environ.get('FLASK_ENV') == 'production':
            request_url = request_url.replace('http://', 'https://')
        print("Modified Request URL:", request_url, file=sys.stderr)

        # Determine the URL to fetch tokens
        google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
        token_endpoint = google_provider_cfg['token_endpoint']

        # Use BASE_URL for the redirect URL
        redirect_url = f"{BASE_URL}/login/callback"
        print("Callback redirect_url:", redirect_url, file=sys.stderr)
        print("Request URL:", request_url, file=sys.stderr)

        # Construct a request to fetch the tokens.
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request_url,  # Use modified URL
            redirect_url=redirect_url,
            code=code
        )

        # Fetch the tokens.
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )

        # Parse the tokens.
        client.parse_request_body_response(json.dumps(token_response.json()))

        # Get the user's profile data.
        userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        userinfo = userinfo_response.json()

        if userinfo.get('email_verified'):
            return {
                'id': userinfo['sub'],
                'email': userinfo['email'],
                'name': userinfo.get('given_name', '')
            }, None
        
        return None, "Email not verified"
    
    except Exception as e:
        return None, str(e)

#-----------------------------------------------------------------------

def logoutapp():

    # Log out of the application.
    flask.session.clear()
    html_code = flask.render_template('index.html')
    response = flask.make_response(html_code)
    return response

#-----------------------------------------------------------------------

def logoutcas():

    # Log out of the application.
    flask.session.clear()

    # Log out of Google.
    flask.abort(flask.redirect(
        'https://mail.google.com/mail/u/0/?logout&hl=en'))

#-----------------------------------------------------------------------

def authenticate():

    if 'email' not in flask.session:
        flask.abort(flask.redirect(flask.url_for('login')))

    email = flask.session.get('email')
    # Extract username from email (everything before @)
    username = email.split('@')[0]
    return username

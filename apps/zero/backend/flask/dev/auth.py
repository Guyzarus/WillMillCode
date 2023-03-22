import json

from configs import CONFIGS
from flask.helpers import make_response
import msal
from my_util import print_if_dev,get_myapp_azure_app_access_token,APIAuthError,APIMsgFormat
from flask import Blueprint,request,redirect,session,url_for
from urllib.parse import urlencode,urlparse, parse_qs
from requests.auth import HTTPBasicAuth
import requests
import azure_ad_verify_token
from azure_ad_verify_token import verify_jwt

myauth =Blueprint("auth", __name__, url_prefix="/auth")


def _validate_delegate_access_token(delegate_access_token,user_id=None):
  try:
    payload = verify_jwt(
      token=delegate_access_token,
      valid_audiences=[CONFIGS.azure_auth["client_id"]],
      issuer=CONFIGS.azure_auth["issuer"],
      jwks_uri=CONFIGS.azure_auth["jwks_url"],
      verify=True,
    )
    # TODO implement this
    if(user_id != None):
      None
  except azure_ad_verify_token.InvalidAuthorizationToken:
    return {
      "valid":False,
      "why":"Token Expired or has bad credentials"
    }
  except azure_ad_verify_token.AzureVerifyTokenError:
    return {
      "valid":False,
      "why":"Something wrong with Azure"
    }

  # print(resp.content)

@myauth.route("/get_new_delegate_access_token",methods=["GET"])
def get_new_delegate_access_token_route():
  refresh_token = request.cookies.get('azure_refresh_token')
  delegate_access_token = get_new_delegate_access_token(refresh_token)
  # _validate_delegate_access_token(delegate_access_token)

  response = APIMsgFormat({},delegate_access_token)
  return response.return_flask_response(),200



@myauth.route("/update_profile",methods=["PATCH"])
def update_user_profile():

  data = request.json["data"]

  try:
    _validate_delegate_access_token(request.json["access_token"],data["user_id"])
  except Exception :
    raise APIAuthError

  app_access_token = get_myapp_azure_app_access_token()


  url = "https://graph.microsoft.com/v1.0/users/{}".format(data["user_id"])
  req_body = json.dumps({
    "givenName":data["first_name"],
    "surname":data["last_name"],
    "city":data["city"],
    "country":data["country"],
    "state": data["state"],
    "postalCode":data["zipcode"],
    "streetAddress":data["address"]
  })
  headers = {
    "Authorization": "Bearer {}".format(app_access_token),
    "Content-Type":"application/json"
  }
  resp = requests.patch(url, req_body,headers=headers)
  return {
    "msg":"A-OK",
    "code": CONFIGS.endpointMsgCodes["success"]
  },204

@myauth.route('/login_callback',methods=['GET'])
def take_actions_after_user_authorization_request():


  cca  = _build_msal_app()
  result = cca.acquire_token_by_authorization_code(request.args["code"],CONFIGS.azure_auth["scope"])


  delegated_access_token = _get_azure_delegate_access_token(request.args["code"])

  userinfo = result.get("id_token_claims")

  query_string = urlencode({
    'user_id': userinfo["sub"],
    'user_name':userinfo["name"],
    'first_name':userinfo['given_name'],
    'last_name':userinfo['family_name'],
    'country':userinfo['country'],
    'access_token':delegated_access_token
  })

  redirect_resp = redirect("{}/profile?{}".format(CONFIGS.app['frontend_angular_app_url'],query_string),code=302)
  redirect_resp.set_cookie(
    'azure_refresh_token',
    result.get("refresh_token"),
    domain=CONFIGS.app['frontend_angular_app_domain'],
    httponly=True,
    samesite="Lax",
    secure=True
  )
  return redirect_resp



@myauth.route('/logout',methods=['GET'])
def logout_route():
  my_resp = make_response()
  my_resp.status_code = 200
  my_resp.set_cookie("azure_refresh_token","",
    domain=CONFIGS.app['frontend_angular_app_domain'],
    httponly=True,
    samesite="Lax",
    secure=True,
    expires=0,max_age=0
  )
  return my_resp



def _get_azure_delegate_access_token(authorization_code):
  url = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/oauth2/v2.0/token".format(
    tenant=CONFIGS.azure_auth["b2c_tenant"],
    policy=CONFIGS.azure_auth["signupsignin_user_flow"]
  )
  headers={
    "Content-Type":"application/x-www-form-urlencoded"
  }
  req_body =urlencode({
    "grant_type":"authorization_code",
    "client_id":CONFIGS.azure_auth["client_id"],
    "scope":"{} offline_access openid".format(CONFIGS.azure_auth["client_id"]),
    "code":authorization_code,
    "client_secret":CONFIGS.azure_auth["client_secret"]
  })
  resp = requests.post(url, headers=headers, data=req_body)
  resp_body = resp.json()
  print_if_dev(resp_body)
  return resp_body["access_token"]


def get_new_delegate_access_token(refresh_token):
  url = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/oauth2/v2.0/token".format(
    tenant=CONFIGS.azure_auth["b2c_tenant"],
    policy=CONFIGS.azure_auth["signupsignin_user_flow"]
  )
  headers={
    "Content-Type":"application/x-www-form-urlencoded"
  }
  req_body =urlencode({
    "grant_type":"refresh_token",
    "client_id":CONFIGS.azure_auth["client_id"],
    "scope":"{} offline_access openid".format(CONFIGS.azure_auth["client_id"]),
    "refresh_token":refresh_token,
    "client_secret":CONFIGS.azure_auth["client_secret"]
  })
  resp = requests.post(url, headers=headers, data=req_body)
  resp_body = resp.json()
  print_if_dev(resp_body)
  return resp_body["access_token"]






def ensure_admin_allows_permission_for_everyone_to_have_an_access_token():
  # middle tiered ccess
  url = "https://login.microsoftonline.com/{}/adminconsent?".format(CONFIGS.azure_auth["ad_tenant_id"])
  query_params = urlencode({
    "client_id":CONFIGS.azure_auth["client_id"],
    "redirect_uri":"{}/auth/access_token_callback".format(CONFIGS.app["domain_name"])
  })

  return redirect(url+query_params)







def _build_msal_app(cache=None, authority=None):

    return msal.ConfidentialClientApplication(
        CONFIGS.azure_auth["client_id"], authority=authority or CONFIGS.azure_auth["signupsignin_authority"],
        client_credential=CONFIGS.azure_auth["client_secret"], token_cache=cache)









const functions = require('firebase-functions');
import regionalFunctions from '../regionalFunctions';
const simpleOauth = require('simple-oauth2');
const randomstring = require('randomstring');

const oauth = functions.config().oauth;
const oauth_provider = oauth.provider || 'github';

// interface OAuthOptions {
//   client_id?: string;
//   client_secret?: string;
//   code: string;
//   grant_type?: string;
//   redirect_uri?: string;
// }

function getScript(mess, content) {
  return `<!doctype html><html><body><script>
  (function() {
    function receiveMessage(e) {
      console.log("receiveMessage %o", e)
      window.opener.postMessage(
        'authorization:github:${mess}:${JSON.stringify(content)}',
        e.origin
      )
      window.removeEventListener("message",receiveMessage,false);
    }
    window.addEventListener("message", receiveMessage, false)
    console.log("Sending message: %o", "github")
    window.opener.postMessage("authorizing:github", "*")
    })()
  </script></body></html>`;
}

const oauth2 = simpleOauth.create({
  client: {
    id: oauth.client_id,
    secret: oauth.client_secret,
  },
  auth: {
    tokenHost: oauth.git_hostname || 'https://github.com',
    tokenPath: oauth.token_path || '/login/oauth/access_token',
    authorizePath: oauth.authorize_path || '/login/oauth/authorize',
  },
});

export const oauthAuthorize = regionalFunctions.https.onRequest(
  async (_, response): Promise<any> => {
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: oauth.redirect_url,
      scope: oauth.scopes || 'repo',
      state: randomstring.generate(32),
    });

    response.redirect(authorizationUri);
  }
);

export const oauthCallback = regionalFunctions.https.onRequest(
  async (request, response): Promise<any> => {
    const options: any = {
      code: request.query.code,
    };

    if (oauth_provider === 'gitlab') {
      options.client_id = oauth.client_id;
      options.client_secret = oauth.client_secret;
      options.grant_type = 'authorization_code';
      options.redirect_uri = oauth.redirect_url;
    }

    try {
      const result = await oauth2.authorizationCode.getToken(options);
      const token = oauth2.accessToken.create(result);

      return response.send(
        getScript('success', {
          token: token.token.access_token,
          provider: oauth_provider,
        })
      );
    } catch (error) {
      console.error('Access Token Error', error.message);
      // request.send(getScript('error', error));
    }
  }
);

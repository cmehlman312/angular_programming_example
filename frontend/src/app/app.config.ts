import { environment } from '../environments/environment';

export default {
  oidc: {
    clientId: `${environment.CLIENT_ID}`,
    issuer: `${environment.ISSUER}`,
    redirectUri: `${environment.REDIRECT_URI}`,
    postLogoutRedirectUri: `${environment.POST_LOGOUT_REDIRECT_URI}`,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
  },
};

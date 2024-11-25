// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // URL of development API
  apiUrl: 'http://localhost:3300',
  ISSUER: 'http://okta.url.goes.here.com/oauth2/',
  CLIENT_ID: 'okta_client_id',
  REDIRECT_URI: 'http://localhost/login/callback',
  POST_LOGOUT_REDIRECT_URI: 'http://localhost/logout',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

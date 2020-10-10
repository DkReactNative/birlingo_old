// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// "http://192.168.1.89:3056/api/webservice/"
export const environment = {
  production: false,
  apiUrl: "https://devnode.devtechnosys.tech:17274/api/webservice/",
  version: "0.0.0",
  setupTime: new Date().getTime(),
  cookieDomain: "localhost",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

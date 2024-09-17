// Interface representing the GM_info object
// declare var GM_info: {
//   script: {
//       description: string;
//       excludes: string[];
//       includes: string[];
//       matches: string[];
//       name: string;
//       namespace: string;
//       resources: Object;
//       "run-at": string;
//       unwrap: boolean;
//       version: string;
//   };
//   scriptMetaStr: string;
//   scriptWillUpdate: boolean;
//   version: string;
// } | undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
var GM_info:
  | {
      script: {
        description: string;
        excludes: string[];
        includes: string[];
        matches: string[];
        name: string;
        namespace: string;
        resources: object;
        'run-at': string;
        unwrap: boolean;
        version: string;
      };
      scriptMetaStr: string;
      scriptWillUpdate: boolean;
      version: string;
    }
  | undefined;

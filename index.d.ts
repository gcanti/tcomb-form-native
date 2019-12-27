declare module "tcomb-form-native" {
  export = {
    enums: any,
    form: any,
    maybe: any,
    refinement: any,
    struct: any,
    Boolean: any,
    Date: any,
    Number: any,
    String: any
  };

  export interface FormRef {}
  export type FormRef = (ref: any) => any;
  export type OnFormChanged = (raw: any, path: Array<string | number>) => void;
}

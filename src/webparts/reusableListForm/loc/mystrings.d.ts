declare interface IReusableListFormWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  DescriptionFieldLabel: string;
  ListFieldLabel: string;
  FormTypeFieldLabel: string;
  ItemIdFieldLabel: string;
  ItemIdFieldDescription: string;
  ShowUnsupportedFieldsLabel: string;
  RedirectUrlFieldLabel: string;
  RedirectUrlFieldDescription: string;
  LocalWorkbenchUnsupported: string;
  MissingListConfiguration: string;
  ConfigureWebpartButtonText: string;
  ErrorOnLoadingLists: string;
}

declare module 'ReusableListFormWebPartStrings' {
  const strings: IReusableListFormWebPartStrings;
  export = strings;
}

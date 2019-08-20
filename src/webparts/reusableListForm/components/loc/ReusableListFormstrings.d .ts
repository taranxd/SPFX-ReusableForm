declare interface IReusableListFormStrings {
  SaveButtonText: string;
  CancelButtonText: string;
  AddNewFieldAction: string;
  LoadingFormIndicator: string;
  ErrorLoadingSchema: string;
  ConfigureListMessage: string;
  RequiredValueMessage: string;
  ErrorLoadingData: string;
  ItemSavedSuccessfully: string;
  FieldsErrorOnSaving: string;
  ErrorOnSavingListItem: string;
  MoveField: string;
  RemoveField: string;
}

declare module 'ReusableListFormStrings' {
  const strings: IReusableListFormStrings;
  export = strings;
}

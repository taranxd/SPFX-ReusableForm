import {Text} from '@microsoft/sp-core-library';
import {ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';
// import * as strings from 'servicesStrings';
import {ControlMode} from '../datatypes/ControlMode';
import {IFieldSchema, RenderListDataOptions} from './datatypes/RenderListData';
import {ISPService} from './ISPService';
import {sp, ItemAddResult} from '@pnp/sp';
import {SPField} from '@microsoft/sp-page-context';

export class SPService {
  private spHttpClient: SPHttpClient;

  public async getAllFieldsOfList(listId: string): Promise<IFieldSchema[]> {
    return new Promise<IFieldSchema[]>((resolve, reject) => {
      let web = sp.web;
      let fields: IFieldSchema[] = [];
      console.log(web.lists.getById(listId).views);
      // and CanBeDeleted eq true
      const filter2 = `Hidden eq false and ReadOnlyField eq false`;
      web.lists
        .getById(listId)
        .fields.filter(filter2)
        .get()
        .then(f => {
          f = f.filter(field => {
            console.log(field);
            if (field.Hidden == false && field.Title !== 'Content Type' && field.Title !== 'Attachments') {
              console.log(`${field.Title} ---> this is true`);
              return true;
            } else {
              console.log(`${field.Title} ---> this is false --> ${field.Hidden}`);
              return false;
            }
            console.log(field);
          });
          fields = f;
          console.log(f.length);
          console.log(fields.length);
          resolve(fields);
        })
        .catch(error => {
          reject(error);
        });
    });
    // let web = sp.web;
    // let fields: IFieldSchema[] = [];
    // web.lists
    //   .getById(listId)
    //   .fields.get()
    //   .then(f => {
    //     fields.push(f[0]);
    //     console.log(f);
    //   });
    // return null;
  }
  public async createListItem(listid: string, valueMap: any): Promise<ItemAddResult> {
    return new Promise<ItemAddResult>((resolve, reject) => {
      // add an item to the list
      sp.web.lists
        .getById(listid)
        .items.add(
          valueMap
          // {
          //   Managed_x0020_Metadata_x0020_Fie: {
          //     Label: 'Managed A',
          //     TermGuid: 'c90ba38a-d4aa-4c78-b4ca-7d09c3a120a7',
          //     WssId: '-1',
          //   },
          //   Lookup_x0020_FieldId: 1,
          //   Title: 'Update MMD',
          // }
        )
        .then((iar: ItemAddResult) => {
          console.log(iar);
          resolve(iar);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }
  // /**
  //  * Gets the schema for all relevant fields for a specified SharePoint list form.
  //  *
  //  * @param webUrl The absolute Url to the SharePoint site.
  //  * @param listUrl The server-relative Url to the SharePoint list.
  //  * @param formType The type of form (Display, New, Edit)
  //  * @returns Promise object represents the array of field schema for all relevant fields for this list form.
  //  */
  // public getFieldSchemasForForm(webUrl: string, listUrl: string, formType: ControlMode): Promise<IFieldSchema[]> {
  //   return new Promise<IFieldSchema[]>((resolve, reject) => {
  //     const httpClientOptions: ISPHttpClientOptions = {
  //       headers: {
  //         Accept: 'application/json;odata=verbose',
  //         'Content-type': 'application/json;odata=verbose',
  //         'X-SP-REQUESTRESOURCES': 'listUrl=' + encodeURIComponent(listUrl),
  //         'odata-version': ''
  //       },
  //       body: JSON.stringify({
  //         parameters: {
  //           __metadata: {
  //             type: 'SP.RenderListDataParameters'
  //           },
  //           ViewXml: '<View><ViewFields><FieldRef Name="ID"/></ViewFields></View>',
  //           RenderOptions: RenderListDataOptions.clientFormSchema
  //         }
  //       })
  //     };
  //     const endpoint =
  //       `${webUrl}/_api/web/GetList(@listUrl)/RenderListDataAsStream` +
  //       `?@listUrl=${encodeURIComponent("'" + listUrl + "'")}`;
  //     this.spHttpClient
  //       .post(endpoint, SPHttpClient.configurations.v1, httpClientOptions)
  //       .then((response: SPHttpClientResponse) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           reject(this.getErrorMessage(webUrl, response));
  //         }
  //       })
  //       .then(data => {
  //         const form = formType === ControlMode.New ? data.ClientForms.New : data.ClientForms.Edit;
  //         resolve(form[Object.keys(form)[0]]);
  //       })
  //       .catch(error => {
  //         reject(this.getErrorMessage(webUrl, error));
  //       });
  //   });
  // }

  // /**
  //  * Retrieves the data for a specified SharePoint list form.
  //  *
  //  * @param webUrl The absolute Url to the SharePoint site.
  //  * @param listUrl The server-relative Url to the SharePoint list.
  //  * @param itemId The ID of the list item to be updated.
  //  * @param formType The type of form (Display, New, Edit)
  //  * @returns Promise representing an object containing all the field values for the list item.
  //  */
  // public getDataForForm(webUrl: string, listUrl: string, itemId: number, formType: ControlMode): Promise<any> {
  //   if (!listUrl || !itemId || itemId === 0) {
  //     return Promise.resolve({}); // no data, so returns empty
  //   }
  //   return new Promise<any>((resolve, reject) => {
  //     const httpClientOptions: ISPHttpClientOptions = {
  //       headers: {
  //         Accept: 'application/json;odata=verbose',
  //         'Content-type': 'application/json;odata=verbose',
  //         'X-SP-REQUESTRESOURCES': 'listUrl=' + encodeURIComponent(listUrl),
  //         'odata-version': ''
  //       }
  //     };
  //     const endpoint =
  //       `${webUrl}/_api/web/GetList(@listUrl)/RenderExtendedListFormData` +
  //       `(itemId=${itemId},formId='editform',mode='2',options=7)` +
  //       `?@listUrl=${encodeURIComponent("'" + listUrl + "'")}`;
  //     this.spHttpClient
  //       .post(endpoint, SPHttpClient.configurations.v1, httpClientOptions)
  //       .then((response: SPHttpClientResponse) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           reject(this.getErrorMessage(webUrl, response));
  //         }
  //       })
  //       .then(data => {
  //         const extendedData = JSON.parse(data.d.RenderExtendedListFormData);
  //         if (formType !== ControlMode.Display) {
  //           resolve(extendedData.ListData);
  //         } else {
  //           resolve(extendedData.Data.Row[0]);
  //         }
  //       })
  //       .catch(error => {
  //         reject(this.getErrorMessage(webUrl, error));
  //       });
  //   });
  // }

  // /**
  //  * Saves the given data to the specified SharePoint list item.
  //  *
  //  * @param webUrl The absolute Url to the SharePoint site.
  //  * @param listUrl The server-relative Url to the SharePoint list.
  //  * @param itemId The ID of the list item to be updated.
  //  * @param fieldsSchema The array of field schema for all relevant fields of this list.
  //  * @param data An object containing all the field values to update.
  //  * @param originalData An object containing all the field values retrieved on loading from list item.
  //  * @returns Promise object represents the updated or erroneous form field values.
  //  */
  // public updateItem(
  //   webUrl: string,
  //   listUrl: string,
  //   itemId: number,
  //   fieldsSchema: IFieldSchema[],
  //   data: any,
  //   originalData: any
  // ): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     const httpClientOptions: ISPHttpClientOptions = {
  //       headers: {
  //         Accept: 'application/json;odata=verbose',
  //         'Content-type': 'application/json;odata=verbose',
  //         'X-SP-REQUESTRESOURCES': 'listUrl=' + encodeURIComponent(listUrl),
  //         'odata-version': ''
  //       }
  //     };
  //     const formValues = this.GetFormValues(fieldsSchema, data, originalData);

  //     httpClientOptions.body = JSON.stringify({
  //       bNewDocumentUpdate: false,
  //       checkInComment: null,
  //       formValues
  //     });
  //     const endpoint =
  //       `${webUrl}/_api/web/GetList(@listUrl)/items(@itemId)/ValidateUpdateListItem()` +
  //       `?@listUrl=${encodeURIComponent("'" + listUrl + "'")}&@itemId=%27${itemId}%27`;
  //     this.spHttpClient
  //       .post(endpoint, SPHttpClient.configurations.v1, httpClientOptions)
  //       .then((response: SPHttpClientResponse) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           reject(this.getErrorMessage(webUrl, response));
  //         }
  //       })
  //       .then(respData => {
  //         resolve(respData.d.ValidateUpdateListItem.results);
  //       })
  //       .catch(error => {
  //         reject(this.getErrorMessage(webUrl, error));
  //       });
  //   });
  // }

  // /**
  //  * Adds a new SharePoint list item to a list using the given data.
  //  *
  //  * @param webUrl The absolute Url to the SharePoint site.
  //  * @param listUrl The server-relative Url to the SharePoint list.
  //  * @param fieldsSchema The array of field schema for all relevant fields of this list.
  //  * @param data An object containing all the field values to set on creating item.
  //  * @returns Promise object represents the updated or erroneous form field values.
  //  */
  // public createItem(webUrl: string, listUrl: string, fieldsSchema: IFieldSchema[], data: any): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     const formValues = this.GetFormValues(fieldsSchema, data, {});
  //     const httpClientOptions: ISPHttpClientOptions = {
  //       headers: {
  //         Accept: 'application/json;odata=verbose',
  //         'Content-type': 'application/json;odata=verbose',
  //         'X-SP-REQUESTRESOURCES': 'listUrl=' + encodeURIComponent(listUrl),
  //         'odata-version': ''
  //       },
  //       body: JSON.stringify({
  //         listItemCreateInfo: {
  //           __metadata: { type: 'SP.ListItemCreationInformationUsingPath' },
  //           FolderPath: {
  //             __metadata: { type: 'SP.ResourcePath' },
  //             DecodedUrl: listUrl
  //           }
  //         },
  //         formValues,
  //         bNewDocumentUpdate: false,
  //         checkInComment: null
  //       })
  //     };
  //     const endpoint =
  //       `${webUrl}/_api/web/GetList(@listUrl)/AddValidateUpdateItemUsingPath` +
  //       `?@listUrl=${encodeURIComponent("'" + listUrl + "'")}`;
  //     this.spHttpClient
  //       .post(endpoint, SPHttpClient.configurations.v1, httpClientOptions)
  //       .then((response: SPHttpClientResponse) => {
  //         if (response.ok) {
  //           return response.json();
  //         } else {
  //           reject(this.getErrorMessage(webUrl, response));
  //         }
  //       })
  //       .then(respData => {
  //         resolve(respData.d.AddValidateUpdateItemUsingPath.results);
  //       })
  //       .catch(error => {
  //         reject(this.getErrorMessage(webUrl, error));
  //       });
  //   });
  // }

  // private GetFormValues(
  //   fieldsSchema: IFieldSchema[],
  //   data: any,
  //   originalData: any
  // ): Array<{ FieldName: string; FieldValue: any; HasException: boolean; ErrorMessage: string }> {
  //   return fieldsSchema
  //     .filter(
  //       field =>
  //         !field.ReadOnlyField &&
  //         field.InternalName in data &&
  //         data[field.InternalName] !== null &&
  //         data[field.InternalName] !== originalData[field.InternalName]
  //     )
  //     .map(field => {
  //       return {
  //         ErrorMessage: null,
  //         FieldName: field.InternalName,
  //         FieldValue: data[field.InternalName],
  //         HasException: false
  //       };
  //     });
  // }

  // /**
  //  * Returns an error message based on the specified error object
  //  * @param error : An error string/object
  //  */
  // private getErrorMessage(webUrl: string, error: any): string {
  //   let errorMessage: string = error.statusText ? error.statusText : error.statusMessage ? error.statusMessage : error;
  //   const serverUrl = `{window.location.protocol}//{window.location.hostname}`;
  //   const webServerRelativeUrl = webUrl.replace(serverUrl, '');

  //   if (error.status === 403) {
  //     errorMessage = Text.format(strings.ErrorWebAccessDenied, webServerRelativeUrl);
  //   } else if (error.status === 404) {
  //     errorMessage = Text.format(strings.ErrorWebNotFound, webServerRelativeUrl);
  //   }
  //   return errorMessage;
  // }
}

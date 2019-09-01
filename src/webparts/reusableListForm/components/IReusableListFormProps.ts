import { SPHttpClient } from '@microsoft/sp-http';
import { ControlMode } from '../../../common/datatypes/ControlMode';
import { IFieldConfiguration } from './IFieldConfiguration';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { string } from 'prop-types';
export interface IReusableListFormProps {
  title: string;
  description?: string;
  webUrl: string;
  listId: string;
  formType: ControlMode;
  id?: number;
  fields?: IFieldConfiguration[];
  spHttpClient: SPHttpClient;
  inDesignMode?: boolean;
  showUnsupportedFields?: boolean;
  onSubmitSucceeded?(id: number): void;
  onSubmitFailed?(fieldErrors: any): void;
  onUpdateFields?(newFields: IFieldConfiguration[]): void;
  context: WebPartContext;
  redirectUrl?: string;
  postSaveCode?: string;
}

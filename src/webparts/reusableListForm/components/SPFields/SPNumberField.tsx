import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {TextField, ITextFieldProps} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPNumberFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPNumberFieldFormState {}

export default class SPNumberField extends React.Component<ISPNumberFieldProps, ISPNumberFieldFormState> {
  public render(): React.ReactElement<ISPNumberFieldProps> {
    return (
      <TextField
        value={this.props.fieldSchema.DefaultValue}
        required={this.props.fieldSchema.Required}
        onChange={this.props.onChange}
        onGetErrorMessage={this._validateNumber}
        placeholder={`Please enter a number`}
      />
    );
  }

  private _validateNumber = (value: string): string => {
    return isNaN(this.parseNumber(value)) ? `Only Numbers are allowed` : '';
  }

  private parseNumber = (value, locale = navigator.language) => {
    const decimalSperator = Intl.NumberFormat(locale)
      .format(1.1)
      .charAt(1);
    // const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
    const cleanPattern = new RegExp(`[${"' ,.".replace(decimalSperator, '')}]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(decimalSperator, '.');
    return Number(normalized);
  }
}

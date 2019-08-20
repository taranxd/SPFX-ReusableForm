import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {TextField, ITextFieldProps} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPTextFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPTextFieldFormState {}

export default class SPTextField extends React.Component<ISPTextFieldProps, ISPTextFieldFormState> {
  public render(): React.ReactElement<ISPTextFieldProps> {
    return (
      <TextField
        value={this.props.fieldSchema.DefaultValue}
        required={this.props.fieldSchema.Required}
        onChange={this.props.onChange}
        errorMessage={this.props.errorMessage}
      />
    );
  }
}

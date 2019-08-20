import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {TextField, ITextFieldProps} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPMLTFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMLTFieldFormState {}

export default class SPMLTField extends React.Component<ISPMLTFieldProps, ISPMLTFieldFormState> {
  public render(): React.ReactElement<ISPMLTFieldProps> {
    return (
      <TextField
        multiline
        autoAdjustHeight
        value={this.props.fieldSchema.DefaultValue}
        required={this.props.fieldSchema.Required}
        onChange={this.props.onChange}
        errorMessage={this.props.errorMessage}
      />
    );
  }
}

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
export interface ISPTextFieldFormState {
  value: string;
}

export default class SPTextField extends React.Component<ISPTextFieldProps, ISPTextFieldFormState> {
  constructor(props: ISPTextFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
    };
  }
  public render(): React.ReactElement<ISPTextFieldProps> {
    return (
      <TextField
        value={this.state.value}
        required={this.props.fieldSchema.Required}
        onChange={this.onChange}
        errorMessage={this.props.errorMessage}
      />
    );
  }
  private onChange = ele => {
    this.setState({
      value: ele.target.value,
    });
    this.props.onChange(ele.target.value, this.props.fieldSchema.Title);
  }
}

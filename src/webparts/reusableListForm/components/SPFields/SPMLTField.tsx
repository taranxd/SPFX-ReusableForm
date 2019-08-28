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
export interface ISPMLTFieldFormState {
  value: string;
}

export default class SPMLTField extends React.Component<ISPMLTFieldProps, ISPMLTFieldFormState> {
  constructor(props: ISPMLTFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
    };
  }
  public render(): React.ReactElement<ISPMLTFieldProps> {
    return (
      <TextField
        multiline
        autoAdjustHeight
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

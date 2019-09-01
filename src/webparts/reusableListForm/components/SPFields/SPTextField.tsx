import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPTextFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPTextFieldFormState {
  value: string;
  isFirstLoad: boolean;
  showError: boolean;
}

export default class SPTextField extends React.Component<ISPTextFieldProps, ISPTextFieldFormState> {
  constructor(props: ISPTextFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
      isFirstLoad: true,
      showError: false
    };
  }
  public render(): React.ReactElement<ISPTextFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <TextField value={this.state.value} required={this.props.fieldSchema.Required} onChange={this.onChange} onGetErrorMessage={this.validate} />
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }
  private validate = (value: string): string => {
    let showError: boolean = false;
    if (this.state.isFirstLoad || !this.props.fieldSchema.Required) {
      return '';
    }
    if (!value) {
      showError = true;
      //return `You can't leave this blank.`;
    }
    this.setState({
      showError: showError
    });
    return '';
  };
  private onChange = ele => {
    this.setState({
      value: ele.target.value,
      isFirstLoad: false
    });
    this.props.onChange(ele.target.value, this.props.fieldSchema.Title);
  };
}

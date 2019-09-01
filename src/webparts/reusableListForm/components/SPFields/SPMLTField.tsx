import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPMLTFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMLTFieldFormState {
  value: string;
  isFirstLoad: boolean;
  showError: boolean;
}

export default class SPMLTField extends React.Component<ISPMLTFieldProps, ISPMLTFieldFormState> {
  constructor(props: ISPMLTFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
      isFirstLoad: true,
      showError: false
    };
  }
  public render(): React.ReactElement<ISPMLTFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <TextField
          multiline
          autoAdjustHeight
          value={this.state.value}
          required={this.props.fieldSchema.Required}
          onChange={this.onChange}
          onGetErrorMessage={this.validate}
        />
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }
  private validate = (value: string): string => {
    let isError = false;
    if (!this.state.isFirstLoad && !value && this.props.fieldSchema.Required) {
      isError = true;
    } else {
      isError = false;
    }
    this.setState({
      isFirstLoad: false,
      showError: isError
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

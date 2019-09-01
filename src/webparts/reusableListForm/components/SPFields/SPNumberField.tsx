import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPNumberFieldProps extends ITextFieldProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPNumberFieldFormState {
  value: string;
  isNumber: boolean;
  isFirstLoad: boolean;
  showError: boolean;
}

export default class SPNumberField extends React.Component<ISPNumberFieldProps, ISPNumberFieldFormState> {
  constructor(props: ISPNumberFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
      isNumber: false,
      isFirstLoad: true,
      showError: false
    };
  }
  public render(): React.ReactElement<ISPNumberFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <TextField
          value={this.state.value}
          required={this.props.fieldSchema.Required}
          onChange={this.onChange}
          onGetErrorMessage={this._validateNumber}
          placeholder={`Please enter a number`}
        />
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }

  private _validateNumber = (value: string): string => {
    if (this.state.isFirstLoad) {
      return '';
    }
    let isValidNumber: boolean;
    isValidNumber = isNaN(this.parseNumber(value));
    this.setState({
      isNumber: isValidNumber
    });
    return isValidNumber ? `Only Numbers are allowed` : '';
  };

  private parseNumber = (value, locale = navigator.language) => {
    const decimalSperator = Intl.NumberFormat(locale)
      .format(1.1)
      .charAt(1);
    // const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
    const cleanPattern = new RegExp(`[${"' ,.".replace(decimalSperator, '')}]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(decimalSperator, '.');
    return Number(normalized);
  };
  private onChange = ele => {
    console.log(ele);
    let showError = false;
    if (!this.state.isFirstLoad && this.props.fieldSchema.Required && !ele.target.value) {
      showError = true;
    }
    this.setState({
      value: ele.target.value,
      isFirstLoad: false,
      showError: showError
    });
    if (!this.state.isNumber) this.props.onChange(ele.target.value, this.props.fieldSchema.Title);
    else this.props.onChange('', this.props.fieldSchema.Title);
  };
}

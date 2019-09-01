import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { DateTimePicker, DateConvention, TimeConvention, IDateTimePickerProps } from '@pnp/spfx-controls-react/lib/dateTimePicker';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPDateTimeFieldProps extends IDateTimePickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
  isDateOnly: boolean;
}
export interface ISPDateTimeFieldFormState {
  selectedDate: Date;
  isFirstLoad: boolean;
  showError: boolean;
}

export default class SPDateTimeField extends React.Component<ISPDateTimeFieldProps, ISPDateTimeFieldFormState> {
  constructor(props: ISPDateTimeFieldProps) {
    super(props);
    if (this.props.fieldSchema.DefaultValue === '[today]') {
      this.props.fieldSchema.DefaultValue = Date();
    }
    let tempSelectedDate = this.props.fieldSchema.DefaultValue ? new Date(this.props.fieldSchema.DefaultValue) : null;
    this.state = {
      selectedDate: tempSelectedDate,
      isFirstLoad: true,
      showError: false
    };
    if (this.props.fieldSchema.DefaultValue) {
      this.handleChange(tempSelectedDate);
    }
  }
  public render(): React.ReactElement<ISPDateTimeFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <DateTimePicker
          label=' '
          dateConvention={this.props.isDateOnly ? DateConvention.Date : DateConvention.DateTime}
          timeConvention={TimeConvention.Hours12}
          value={this.state.selectedDate ? this.state.selectedDate : null}
          onChange={this.handleChange}
          key={this.props.fieldSchema.InternalName}
          showGoToToday={true}
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
  private validate = (value: Date): string => {
    let showError: boolean = false;
    if (!this.state.isFirstLoad && this.props.fieldSchema.Required && !value) {
      showError = true;
    } else {
      showError = false;
    }
    this.setState({
      showError: showError
    });
    return '';
  };
  private handleChange = value => {
    console.log(`This is dateony: ${this.props.isDateOnly}`);
    console.log(value);
    this.props.onChange(`${new Date(value).getMonth() + 1}/${new Date(value).getDate()}/${new Date(value).getFullYear()}`, this.props.fieldSchema.Title);
    console.log(`${new Date(value).getMonth() + 1}/${new Date(value).getDate()}/${new Date(value).getFullYear()}`);
    this.setState({
      selectedDate: value,
      isFirstLoad: false,
      showError: false
    });
  };
}

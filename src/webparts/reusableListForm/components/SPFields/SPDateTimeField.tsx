import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {
  DateTimePicker,
  DateConvention,
  TimeConvention,
  IDateTimePickerProps,
} from '@pnp/spfx-controls-react/lib/dateTimePicker';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPDateTimeFieldProps extends IDateTimePickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
  isDateOnly: boolean;
}
export interface ISPDateTimeFieldFormState {
  selectedDate: Date;
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
    };
    if (this.props.fieldSchema.DefaultValue) {
      this.handleChange(tempSelectedDate);
    }
  }
  public render(): React.ReactElement<ISPDateTimeFieldProps> {
    return (
      <DateTimePicker
        label=" "
        dateConvention={this.props.isDateOnly ? DateConvention.Date : DateConvention.DateTime}
        timeConvention={TimeConvention.Hours12}
        value={this.state.selectedDate ? this.state.selectedDate : null}
        onChange={this.handleChange}
        key={this.props.fieldSchema.InternalName}
        showGoToToday={true}
      />
    );
  }
  private handleChange = value => {
    console.log(`This is dateony: ${this.props.isDateOnly}`);
    console.log(value);
    this.props.onChange(
      `${new Date(value).getMonth() + 1}/${new Date(value).getDate()}/${new Date(value).getFullYear()}`,
      this.props.fieldSchema.Title
    );
    console.log(`${new Date(value).getMonth() + 1}/${new Date(value).getDate()}/${new Date(value).getFullYear()}`);
    this.setState({
      selectedDate: value,
    });
  }
}

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
    // let defaultTerm = '';
    // let initialTerms: IPickerTerms = [];
    // if (this.props.fieldSchema.DefaultValue.indexOf('|') > -1) {
    //   defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1].trim();
    //   initialTerms.push({
    //     key: defaultTerm,
    //     name: this.props.fieldSchema.DefaultValue.split('|')[0]
    //       .split('#')[1]
    //       .trim(),
    //     termSet: this.props.fieldSchema.TermSetId,
    //     path: this.props.fieldSchema.DefaultValue.split('|')[0]
    //       .split('#')[1]
    //       .trim(),
    //   });
    // }
    // defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1];
    this.state = {
      selectedDate: this.props.fieldSchema.DefaultValue ? new Date(this.props.fieldSchema.DefaultValue) : null,
    };
  }
  public render(): React.ReactElement<ISPDateTimeFieldProps> {
    return (
      <DateTimePicker
        label=""
        dateConvention={this.props.isDateOnly ? DateConvention.Date : DateConvention.DateTime}
        timeConvention={TimeConvention.Hours12}
        value={this.state.selectedDate ? this.state.selectedDate : null}
        onChange={this.handleChange}
        key={this.props.fieldSchema.InternalName}
      />
    );
  }
  private handleChange = value => {
    console.log(value);
    // this.setState({
    //   selectedTerms: terms,
    //   //termKey: terms[0].key.toString()
    // });
    // console.log('Terms', terms);
  }
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {Dropdown, IDropdownProps, IDropdownOption} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPChoiceFieldProps extends IDropdownProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPChoiceFieldFormState {
  options: IDropdownOption[];
  selectedOption: IDropdownOption;
}

export default class SPChoiceField extends React.Component<ISPChoiceFieldProps, ISPChoiceFieldFormState> {
  constructor(props: ISPChoiceFieldProps) {
    super(props);
    let options: IDropdownOption[] = [];
    this.props.fieldSchema.Choices.forEach(choice => {
      options.push({key: choice, text: choice});
    });
    let selectedOption;
    options.forEach(choice => {
      if (choice.key === this.props.fieldSchema.DefaultValue) {
        selectedOption = choice;
      }
    });
    this.state = {
      options: options,
      selectedOption: selectedOption,
    };
  }
  public render(): React.ReactElement<ISPChoiceFieldProps> {
    return (
      <Dropdown
        //placeHolder="Select an Option"
        label=""
        id="DropDownChoice"
        selectedKey={this.state.selectedOption.key}
        //selectedKey={dpselectedItem ? dpselectedItem.key : undefined}
        //ariaLabel="Basic dropdown example"
        options={
          this.state.options
          //   [
          //   {key: 'Human Resource', text: 'Human Resource'},
          //   {key: 'Finance', text: 'Finance'},
          //   {key: 'Employee', text: 'Employee'},
          // ]
        }
        //onChanged={this._changeState}
        //onFocus={this._log('onFocus called')}
        //onBlur={this._log('onBlur called')}
      />
    );
  }
}

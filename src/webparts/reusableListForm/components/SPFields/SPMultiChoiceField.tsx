import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {Dropdown, IDropdownProps, IDropdownOption} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';
import {PropertyFieldMultiSelect} from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';

export interface ISPChoiceFieldProps extends IDropdownProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMultiChoiceFieldFormState {
  options: IDropdownOption[];
  selectedOption: IDropdownOption;
  multiSelect: string[];
}

export default class SPMultiChoiceField extends React.Component<ISPChoiceFieldProps, ISPMultiChoiceFieldFormState> {
  constructor(props: ISPChoiceFieldProps) {
    super(props);
    let options: IDropdownOption[] = [];
    let multiOptions = [];
    this.props.fieldSchema.Choices.forEach(choice => {
      options.push({key: choice, text: choice});
    });
    let selectedOption;
    options.forEach(choice => {
      if (choice.key === this.props.fieldSchema.DefaultValue) {
        selectedOption = choice;
        multiOptions.push(choice.key);
      }
    });
    this.state = {
      options: options,
      selectedOption: selectedOption,
      multiSelect: multiOptions,
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
        options={this.state.options}
        onChange={this._onChange}
        //onFocus={this._log('onFocus called')}
        //onBlur={this._log('onBlur called')}
      />
    );
  }
  private _onChange = (ev: React.FormEvent<HTMLDivElement>, selectedItem: IDropdownOption) => {
    this.setState({
      selectedOption: selectedItem,
    });
    this.props.onChange(selectedItem.text, this.props.fieldSchema.Title);
  }
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { Dropdown, IDropdownProps, IDropdownOption } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

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
      options.push({ key: choice, text: choice });
    });
    let selectedOption;
    options.forEach(choice => {
      if (choice.key === this.props.fieldSchema.DefaultValue) {
        selectedOption = choice;
      }
    });
    this.state = {
      options: options,
      selectedOption: selectedOption
    };
  }
  public render(): React.ReactElement<ISPChoiceFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <Dropdown
          label=''
          id={this.props.fieldSchema.InternalName}
          selectedKey={this.state.selectedOption ? this.state.selectedOption.key : ''}
          options={this.state.options}
          onChange={this._onChange}
          required={this.props.fieldSchema.Required}
        />
      </div>
    );
  }
  private _onChange = (ev: React.FormEvent<HTMLDivElement>, selectedItem: IDropdownOption) => {
    this.setState({
      selectedOption: selectedItem
    });
    this.props.onChange(selectedItem.text, this.props.fieldSchema.Title);
  };
}

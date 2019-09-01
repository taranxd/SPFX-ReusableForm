import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { Dropdown, IDropdownProps, IDropdownOption, ShimmerElementsGroup } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode, DateTimeFieldFriendlyFormatType } from '@pnp/sp';

export interface ISPMultiChoiceFieldProps extends IDropdownProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMultiChoiceFieldFormState {
  options: IDropdownOption[];
  selectedKeys: any[];
}

export default class SPMultiChoiceField extends React.Component<ISPMultiChoiceFieldProps, ISPMultiChoiceFieldFormState> {
  constructor(props: ISPMultiChoiceFieldProps) {
    super(props);
    let options: IDropdownOption[] = [];
    this.props.fieldSchema.Choices.forEach(choice => {
      options.push({ key: choice, text: choice });
    });
    let selectedKeys = [];
    options.forEach(choice => {
      if (choice.key === this.props.fieldSchema.DefaultValue) {
        selectedKeys.push(choice);
      }
    });
    this.state = {
      options: options,
      selectedKeys: selectedKeys
    };
  }
  public render(): React.ReactElement<ISPMultiChoiceFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <Dropdown
          label=''
          id={this.props.fieldSchema.InternalName}
          defaultSelectedKeys={this.state.selectedKeys.length > 0 ? this.state.selectedKeys : this.state.options}
          options={this.state.options}
          onChange={this._onChange}
          required={this.props.fieldSchema.Required}
          multiSelect
        />
      </div>
    );
  }
  private _onChange = (ev: React.FormEvent<HTMLDivElement>, selectedItem: IDropdownOption) => {
    let tempKeys = this.state.selectedKeys;
    if (selectedItem.selected) {
      tempKeys.push(selectedItem.key);
    } else {
      tempKeys = tempKeys.filter(item => {
        if (item === selectedItem.key) {
          return false;
        } else {
          return true;
        }
      });
    }
    console.log(tempKeys);
    this.setState({
      selectedKeys: tempKeys
    });
    this.props.onChange(selectedItem.text, this.props.fieldSchema.Title);
  };
}

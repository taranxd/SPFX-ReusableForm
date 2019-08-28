import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {PeoplePicker, PrincipalType, IPeoplePickerProps} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPPeoplePicker extends IPeoplePickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
  selectedItem?: void;
  multiUser: boolean;
}
export interface ISPPeoplePickerFieldFormState {
  selectedItems: any[];
}

export default class SPPeoplePickerField extends React.Component<ISPPeoplePicker, ISPPeoplePickerFieldFormState> {
  constructor(props: ISPPeoplePicker) {
    super(props);
    this.state = {
      selectedItems: Array(this.props.fieldSchema.DefaultValue),
    };
  }
  public render(): React.ReactElement<ISPPeoplePicker> {
    return (
      <PeoplePicker
        context={this.props.context}
        titleText=" "
        personSelectionLimit={this.props.multiUser ? 100 : 1}
        showtooltip={true}
        isRequired={this.props.isRequired}
        showHiddenInUI={false}
        principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup]}
        resolveDelay={1000}
        selectedItems={this._getPeoplePickerItems}
        key={this.props.fieldSchema.InternalName}
        ensureUser={true}
      />
    );
  }

  private _getPeoplePickerItems = (items: any[]) => {
    console.log('Items:', items);
    this.setState({
      selectedItems: items,
    });
    this.props.onChange(items, this.props.fieldSchema.Title);
  }
}

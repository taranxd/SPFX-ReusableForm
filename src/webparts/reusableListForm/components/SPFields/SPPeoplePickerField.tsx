import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { PeoplePicker, PrincipalType, IPeoplePickerProps } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

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
  showError: boolean;
  isFirstLoad: boolean;
}

export default class SPPeoplePickerField extends React.Component<ISPPeoplePicker, ISPPeoplePickerFieldFormState> {
  constructor(props: ISPPeoplePicker) {
    super(props);
    this.state = {
      selectedItems: Array(this.props.fieldSchema.DefaultValue),
      showError: false,
      isFirstLoad: true
    };
  }
  public render(): React.ReactElement<ISPPeoplePicker> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <PeoplePicker
          context={this.props.context}
          titleText=' '
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
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }

  private _getPeoplePickerItems = (items: any[]) => {
    console.log('Items:', items);
    let isError = false;
    if (!this.state.isFirstLoad && items.length === 0 && this.props.fieldSchema.Required) {
      isError = true;
    } else {
      isError = false;
    }
    this.setState({
      selectedItems: items,
      isFirstLoad: false,
      showError: isError
    });
    this.props.onChange(items, this.props.fieldSchema.Title);
  };
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { ListItemPicker, IListItemPickerProps } from '@pnp/spfx-controls-react/lib/listItemPicker';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPLookup extends IListItemPickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
  selectedItem?: (item: any, key?: any) => void;
}
export interface ISPLookupFieldFormState {
  selectedItems: any[];
  showError: boolean;
  isFirstLoad: boolean;
}

export default class SPLookupField extends React.Component<ISPLookup, ISPLookupFieldFormState> {
  constructor(props: ISPLookup) {
    super(props);
    this.state = {
      selectedItems: Array(this.props.fieldSchema.DefaultValue),
      showError: false,
      isFirstLoad: true
    };
  }
  public render(): React.ReactElement<ISPLookup> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <ListItemPicker
          listId={this.props.listId}
          columnInternalName={this.props.columnInternalName}
          itemLimit={this.props.itemLimit}
          onSelectedItem={this.onSelectedItem}
          context={this.props.context}
          key={this.props.fieldSchema.InternalName}
        />
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }

  private onSelectedItem = (items: any[]) => {
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
      //termKey: terms[0].key.toString()
    });
    console.log(this.props.fieldSchema.Title);
    this.props.selectedItem(items, this.props.fieldSchema.Title);
  };
}

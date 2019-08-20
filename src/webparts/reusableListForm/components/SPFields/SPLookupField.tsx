import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {ListItemPicker, IListItemPickerProps} from '@pnp/spfx-controls-react/lib/listItemPicker';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPLookup extends IListItemPickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
  selectedItem?: (item: any, key?: any) => void;
}
export interface ISPLookupFieldFormState {
  selectedItems: any[];
}

export default class SPLookupField extends React.Component<ISPLookup, ISPLookupFieldFormState> {
  constructor(props: ISPLookup) {
    super(props);
    this.state = {
      selectedItems: Array(this.props.fieldSchema.DefaultValue),
    };
  }
  public render(): React.ReactElement<ISPLookup> {
    return (
      <ListItemPicker
        listId={this.props.listId}
        columnInternalName={this.props.columnInternalName}
        itemLimit={1}
        onSelectedItem={this.onSelectedItem}
        context={this.props.context}
        key={this.props.fieldSchema.InternalName}
      />
    );
  }

  private onSelectedItem = (items: any[]) => {
    console.log('Items:', items);
    this.setState({
      selectedItems: items,
      //termKey: terms[0].key.toString()
    });
    this.props.selectedItem(items, this.props.fieldSchema.InternalName);
  }
}

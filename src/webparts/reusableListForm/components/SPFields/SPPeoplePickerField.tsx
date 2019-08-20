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

    //   let defaultTerm = '';
    //  // let initialTerms: IPickerTerms = [];
    //   if (this.props.fieldSchema.DefaultValue.indexOf('|') > -1) {
    //     defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1].trim();
    //     initialTerms.push({
    //       key: defaultTerm,
    //       name: this.props.fieldSchema.DefaultValue.split('|')[0]
    //         .split('#')[1]
    //         .trim(),
    //       termSet: this.props.fieldSchema.TermSetId,
    //       path: this.props.fieldSchema.DefaultValue.split('|')[0]
    //         .split('#')[1]
    //         .trim(),
    //     });
    //   }
    //   defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1];
    //   this.state = {
    //     termKey: defaultTerm,
    //     //selectedTerms: initialTerms,
    //   };
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
        //personSelectionLimit={3}
        // groupName={this.props.fieldSchema.} // Leave this blank in case you want to filter from all users
        showtooltip={true}
        isRequired={this.props.isRequired}
        // disabled={true}
        // defaultSelectedUsers={Array(this.props.fieldSchema.DefaultValue)}
        // selectedItems={this.props.fieldSchema.DefaultValue?this.props.fieldSchema.DefaultValue:this.state.selectedItems}
        showHiddenInUI={false}
        // principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup]}
        resolveDelay={1000}
        selectedItems={this._getPeoplePickerItems}
        key={this.props.fieldSchema.InternalName}
      />
      // <TaxonomyPicker
      //   allowMultipleSelections={this.props.fieldSchema.AllowMultipleValues}
      //   termsetNameOrID={this.props.fieldSchema.TermSetId}
      //   panelTitle={this.props.panelTitle ? this.props.panelTitle : 'Select Terms'}
      //   label={this.props.label ? this.props.label : ''}
      //   context={this.props.context}
      //   onChange={this.props.onChange ? this.props.onChange : this.onTaxPickerChange}
      //   isTermSetSelectable={false}
      //   initialValues={this.state.selectedTerms}
      //   //required={this.props.fieldSchema.Required}
      // />
    );
  }

  private _getPeoplePickerItems = (items: any[]) => {
    console.log('Items:', items);
    this.setState({
      selectedItems: items,
      //termKey: terms[0].key.toString()
    });
  }
}

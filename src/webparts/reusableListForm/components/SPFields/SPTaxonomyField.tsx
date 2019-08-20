import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {TaxonomyPicker, IPickerTerms, ITaxonomyPickerProps} from '@pnp/spfx-controls-react/lib/TaxonomyPicker';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPTaxonomyFieldProps extends ITaxonomyPickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPTaxonomyFieldFormState {
  termKey: string;
  selectedTerms: IPickerTerms;
}

export default class SPTaxonomyField extends React.Component<ISPTaxonomyFieldProps, ISPTaxonomyFieldFormState> {
  constructor(props: ISPTaxonomyFieldProps) {
    super(props);

    let defaultTerm = '';
    let initialTerms: IPickerTerms = [];
    if (this.props.fieldSchema.DefaultValue.indexOf('|') > -1) {
      defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1].trim();
      initialTerms.push({
        key: defaultTerm,
        name: this.props.fieldSchema.DefaultValue.split('|')[0]
          .split('#')[1]
          .trim(),
        termSet: this.props.fieldSchema.TermSetId,
        path: this.props.fieldSchema.DefaultValue.split('|')[0]
          .split('#')[1]
          .trim(),
      });
    }
    defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1];
    this.state = {
      termKey: defaultTerm,
      selectedTerms: initialTerms,
    };
  }
  public render(): React.ReactElement<ISPTaxonomyFieldProps> {
    return (
      <TaxonomyPicker
        allowMultipleSelections={this.props.fieldSchema.AllowMultipleValues}
        termsetNameOrID={this.props.fieldSchema.TermSetId}
        panelTitle={this.props.panelTitle ? this.props.panelTitle : 'Select Terms'}
        label={this.props.label ? this.props.label : ''}
        context={this.props.context}
        onChange={this.props.onChange ? this.props.onChange : this.onTaxPickerChange}
        isTermSetSelectable={false}
        initialValues={this.state.selectedTerms}
        //required={this.props.fieldSchema.Required}
      />
    );
  }
  private onTaxPickerChange = (terms: IPickerTerms) => {
    this.setState({
      selectedTerms: terms,
      //termKey: terms[0].key.toString()
    });
    console.log('Terms', terms);
  }
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { TaxonomyPicker, IPickerTerms, ITaxonomyPickerProps } from '@pnp/spfx-controls-react/lib/TaxonomyPicker';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPTaxonomyFieldProps extends ITaxonomyPickerProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPTaxonomyFieldFormState {
  termKey: string;
  selectedTerms: IPickerTerms;
  showError: boolean;
  isFirstLoad: boolean;
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
          .trim()
      });
    }
    defaultTerm = this.props.fieldSchema.DefaultValue.split('|')[1];
    this.state = {
      termKey: defaultTerm,
      selectedTerms: initialTerms,
      showError: false,
      isFirstLoad: true
    };
    this.onTaxPickerChange(initialTerms);
  }
  public render(): React.ReactElement<ISPTaxonomyFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <TaxonomyPicker
          allowMultipleSelections={this.props.fieldSchema.AllowMultipleValues}
          termsetNameOrID={this.props.fieldSchema.TermSetId}
          panelTitle={this.props.panelTitle ? this.props.panelTitle : 'Select Terms'}
          label={this.props.label ? this.props.label : ''}
          context={this.props.context}
          onChange={this.onTaxPickerChange}
          isTermSetSelectable={false}
          initialValues={this.state.selectedTerms}
          //required={this.props.fieldSchema.Required}
        />
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }
  private onTaxPickerChange = (terms: IPickerTerms) => {
    let isError = false;
    if (!this.state.isFirstLoad && terms.length === 0 && this.props.fieldSchema.Required) {
      isError = true;
    } else {
      isError = false;
    }
    this.setState({
      selectedTerms: terms,
      isFirstLoad: false,
      showError: isError
    });
    console.log('Terms', terms);
    let termKeys = [];
    terms.map(term => {
      termKeys.push(term.key);
    });
    this.props.onChange(terms, this.props.fieldSchema.Title);
  };
}

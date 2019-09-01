import * as React from 'react';
import styles from './ReusableListForm.module.scss';
import { IReusableListFormProps } from './IReusableListFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ControlMode } from '../../../common/datatypes/ControlMode';
import { SPService } from '../../../common/services/SPServices';
import { IFieldSchema } from '../../../common/services/datatypes/RenderListData';
import SPTextField from '../components/SPFields/SPTextField';
import SPBoolField from '../components/SPFields/SPBoolField';
import SPChoiceField from '../components/SPFields/SPChoiceField';
import SPMultiChoiceField from '../components/SPFields/SPMultiChoiceField';
import SPTaxonomyField from '../components/SPFields/SPTaxonomyField';
import SPMLTField from '../components/SPFields/SPMLTField';
import SPPeoplePickerField from '../components/SPFields/SPPeoplePickerField';
import SPDateTimeField from '../components/SPFields/SPDateTimeField';
import SPMLTRichField from '../components/SPFields/SPMLTRichField';
import SPNumberField from '../components/SPFields/SPNumberField';
import SPLookupField from '../components/SPFields/SPLookupField';

import {
  Toggle,
  Dropdown,
  TextField,
  Checkbox,
  PrimaryButton,
  DefaultButton,
  Panel,
  PanelType,
  Dialog,
  DialogType,
  DialogFooter
} from 'office-ui-fabric-react/lib/';

interface IFieldRender {
  fieldSchema: IFieldSchema;
  fieldRenderer?: JSX.Element;
  fieldValue?: any;
}
interface IReusableListFormState {
  isLoadingSchema: boolean;
  isLoadingData: boolean;
  isSaving: boolean;
  fieldsSchema?: IFieldSchema[];
  //fieldsSchema?: any;
  data: any;
  originalData: any;
  errors: string[];
  notifications: string[];
  fieldErrors: { [fieldName: string]: string };
  showUnsupportedFields?: boolean;
  fieldRenderer?: IFieldRender[];
  valueMap?: { [fieldTitle: string]: IFieldRender };
  mmdValueMap?: { [fieldTitle: string]: IFieldRender };
}

export default class ReusableListForm extends React.Component<IReusableListFormProps, IReusableListFormState> {
  private spService: SPService;
  constructor(props: IReusableListFormProps) {
    super(props);
    this.state = {
      isLoadingSchema: false,
      isLoadingData: false,
      isSaving: false,
      data: {},
      originalData: {},
      errors: [],
      notifications: [],
      fieldErrors: {},
      valueMap: {}
    };
    this.spService = new SPService();
  }

  public render(): React.ReactElement<IReusableListFormProps> {
    if (this.state.fieldsSchema) {
      return (
        //<div className={styles.reusableListForm}>
        //<div className={styles.container}>{this.renderForm()}</div>
        //</div>
        this.renderForm()
      );
    } else {
      return (
        <div className={styles.reusableListForm}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.column}>
                <span className={styles.title}>Welcome to SharePoint!</span>
                <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
                <p className={styles.description}>{escape(this.props.description)}</p>
                <a href='https://aka.ms/spfx' className={styles.button}>
                  <span className={styles.label}>Learn more</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  public componentWillMount(): void {
    // FieldRendererHelper.getFieldRenderer(this.props.value, {
    //   className: this.props.className,
    //   cssProps: this.props.cssProps
    // }, this.props.listItem, this.props.context).then(fieldRenderer => {
    //   this.setState({
    //     fieldRenderer: fieldRenderer
    //   });
    // });
  }
  public componentDidMount(): void {
    this.readSchema(this.props.listId, this.props.formType).then(() => {
      // this.readData(this.props.listId, this.props.formType, this.props.id)
      // this.createValueMap();
      console.log('Read Schema Completed');
      // Inititalize Value Map
    });
  }
  public componentDidUpdate(): void {
    // this.readSchema(this.props.listId, this.props.formType).then(() => {
    //   // this.readData(this.props.listId, this.props.formType, this.props.id)
    //   // this.createValueMap();
    //   console.log('Read Schema Completed');
    //   // Inititalize Value Map
    // });
    console.log('Component Updated');
  }
  public componentWillReceiveProps(newProps) {
    console.log('new props');
    this.readSchema(newProps.listId, newProps.formType).then(() => {
      // this.readData(this.props.listId, this.props.formType, this.props.id)
      // this.createValueMap();
      console.log('Read Schema Completed');
      // Inititalize Value Map
    });
  }
  private createValueMap = fieldSchema => {
    let tempValueMap: { [fieldTitle: string]: IFieldRender } = {};
    fieldSchema.map(field => {
      let fr: IFieldRender = { fieldSchema: field };
      fr.fieldValue = field.DefaultValue;
      tempValueMap[field.Title] = fr;
    });
    // console.log(tempValueMap);
    // this.setState({
    //   ...this.state,
    //   valueMap: tempValueMap,
    // });
    return tempValueMap;
  };
  // @autobind
  private async readSchema(listId: string, formType: ControlMode): Promise<void> {
    try {
      if (!listId) {
        this.setState({
          ...this.state,
          isLoadingSchema: false,
          fieldsSchema: null,
          errors: ['strings.ConfigureListMessage']
        });
        return;
      }
      this.setState({ ...this.state, isLoadingSchema: true });
      const fieldsSchema = await this.spService.getAllFieldsOfList(listId);
      let vmap = this.createValueMap(fieldsSchema);
      console.log('all fields are fetched');
      console.log(fieldsSchema);
      this.setState({ ...this.state, valueMap: vmap, isLoadingSchema: false, fieldsSchema });
    } catch (error) {
      const errorText = `'Error: ': ${error}`;
      this.setState({
        ...this.state,
        isLoadingSchema: false,
        fieldsSchema: null,
        errors: [...this.state.errors, errorText]
      });
    }
  }
  private renderForm() {
    return (
      <form>
        <div className={styles.reusableListForm}>
          <div className={styles.container}>
            {this.state.fieldsSchema.map((field, idx) => {
              return this.renderField(field);
            })}
            <div className='ms-Grid-col ms-u-sm6 block' />
            <div className={`ms-Grid-row ${styles.row}`}>
              <div className='ms-Grid-col ms-u-sm2 block'>
                <DefaultButton
                  text='Create Item'
                  onClick={() => {
                    this.validateForm();
                  }}
                />
              </div>
              <div className='ms-Grid-col ms-u-sm2 block'>
                <DefaultButton
                  text='Cancel Item'
                  onClick={() => {
                    this.setState({
                      valueMap: {}
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
  /* /* <div className={`ms-Grid-row ms-bgColor-neutralLight ms-fontColor-white ${styles.row}`}>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Employee Name</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TextField
                  value={this.state.name}
                  required={true}
                  onChanged={this.handleTitle}
                  errorMessage={
                    this.state.name.length === 0 && this.state.onSubmission === true ? this.state.required : ''
                  }
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Job Description</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TextField multiline autoAdjustHeight value={this.state.description} onChanged={this.handleDesc} />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Project Assigned To</label>
                <br />
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <TaxonomyPicker
                  allowMultipleSelections={false}
                  termsetNameOrID="BU"
                  panelTitle="Select Assignment"
                  label=""
                  context={this.props.context}
                  onChange={this.onTaxPickerChange}
                  isTermSetSelectable={false}
                />
                <p
                  className={
                    this.state.termKey === undefined && this.state.onSubmission === true
                      ? styles.fontRed
                      : styles.hideElement
                  }
                >
                  This is required
                </p>
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Department</label>
                <br />
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <Dropdown
                  placeHolder="Select an Option"
                  label=""
                  id="component"
                  selectedKey={dpselectedItem ? dpselectedItem.key : undefined}
                  ariaLabel="Basic dropdown example"
                  options={[
                    {key: 'Human Resource', text: 'Human Resource'},
                    {key: 'Finance', text: 'Finance'},
                    {key: 'Employee', text: 'Employee'},
                  ]}
                  onChanged={this._changeState}
                  onFocus={this._log('onFocus called')}
                  onBlur={this._log('onBlur called')}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">External Hiring?</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <Toggle
                  disabled={this.state.disableToggle}
                  checked={this.state.defaultChecked}
                  label=""
                  onAriaLabel="This toggle is checked. Press to uncheck."
                  offAriaLabel="This toggle is unchecked. Press to check."
                  onText="On"
                  offText="Off"
                  onChanged={checked => this._changeSharing(checked)}
                  onFocus={() => console.log('onFocus called')}
                  onBlur={() => console.log('onBlur called')}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm4 block">
                <label className="ms-Label">Reporting Manager</label>
              </div>
              <div className="ms-Grid-col ms-u-sm8 block">
                <PeoplePicker
                  context={this.props.context}
                  titleText=" "
                  personSelectionLimit={1}
                  groupName={''} // Leave this blank in case you want to filter from all users
                  showtooltip={false}
                  isRequired={true}
                  disabled={false}
                  selectedItems={this._getManager}
                  errorMessage={
                    this.state.userManagerIDs.length === 0 && this.state.onSubmission === true
                      ? this.state.required
                      : ' '
                  }
                  errorMessageclassName={styles.hideElementManager}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm1 block">
                <Checkbox onChange={this._onCheckboxChange} ariaDescribedBy={'descriptionID'} />
              </div>
              <div className="ms-Grid-col ms-u-sm11 block">
                <span className={`${styles.customFont}`}>I have read and agree to the terms & condition</span>
                <br />
                <p
                  className={
                    this.state.termnCond === false && this.state.onSubmission === true
                      ? styles.fontRed
                      : styles.hideElement
                  }
                >
                  Please check the Terms & Condition
                </p>
              </div>
              <div className="ms-Grid-col ms-u-sm6 block" />
              <div className="ms-Grid-col ms-u-sm2 block">
                <PrimaryButton
                  text="Create"
                  onClick={() => {
                    this.validateForm();
                  }}
                />
              </div>
              <div className="ms-Grid-col ms-u-sm2 block">
                <DefaultButton
                  text="Cancel"
                  onClick={() => {
                    this.setState({});
                  }}
                />
              </div>
              <div>
                <Panel
                  isOpen={this.state.showPanel}
                  type={PanelType.smallFixedFar}
                  onDismiss={this._onClosePanel}
                  isFooterAtBottom={false}
                  headerText="Are you sure you want to create site ?"
                  closeButtonAriaLabel="Close"
                  onRenderFooterContent={this._onRenderFooterContent}
                >
                  <span>Please check the details filled and click on Confirm button to create site.</span>
                </Panel>
              </div>
              <Dialog
                hidden={this.state.hideDialog}
                onDismiss={this._closeDialog}
                dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Request Submitted Successfully',
                  subText: '',
                }}
                modalProps={{
                  titleAriaId: 'myLabelId',
                  subtitleAriaId: 'mySubTextId',
                  isBlocking: false,
                  containerClassName: 'ms-dialogMainOverride',
                }}
              >
                <div dangerouslySetInnerHTML={{__html: this.state.status}} />
                <DialogFooter>
                  <PrimaryButton onClick={() => this.gotoHomePage()} text="Okay" />
                </DialogFooter>
              </Dialog>
            </div>
          </div>
        </div> }
      </form>
    );
    */
  private renderField(field) {
    return (
      <div className={`ms-Grid-row ${styles.row}`}>
        <div className='ms-Grid-col ms-u-sm4 block'>
          <label className='ms-Label'>{field.Title}</label>
        </div>
        <div className='ms-Grid-col ms-u-sm8 block'>
          {(() => {
            switch (field.TypeAsString) {
              case 'Text':
                return <SPTextField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
              case 'Number':
                return <SPNumberField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
              case 'Currency':
                return <SPNumberField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
              case 'Boolean':
                return <SPBoolField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
              case 'Choice': {
                let ddOptions = field.Choices.map(option => {
                  return { key: option, text: option };
                });
                return <SPChoiceField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} options={ddOptions} />;
              }
              /* case 'MultiChoice': {
                let ddOptions = field.Choices.map(option => {
                  return { key: option, text: option };
                });
                return <SPMultiChoiceField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} options={ddOptions} />;
              } */
              case 'TaxonomyFieldType': {
                return (
                  <SPTaxonomyField
                    fieldSchema={field}
                    onChange={this.handleMMDFieldChange}
                    formMode={this.props.formType}
                    context={this.props.context}
                    panelTitle='Select Terms'
                    label=''
                    termsetNameOrID={field.termsetNameOrID}
                  />
                );
              }
              case 'Note': {
                if (field.RichText) {
                  return <SPMLTRichField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
                } else {
                  return <SPMLTField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} />;
                }
              }
              case 'UserMulti': {
                return (
                  <SPPeoplePickerField
                    context={this.props.context}
                    fieldSchema={field}
                    onChange={this.handleUserFieldChange}
                    formMode={this.props.formType}
                    multiUser={true}
                  />
                );
              }
              case 'User': {
                return (
                  <SPPeoplePickerField
                    context={this.props.context}
                    fieldSchema={field}
                    onChange={this.handleUserFieldChange}
                    formMode={this.props.formType}
                    multiUser={false}
                  />
                );
              }
              case 'DateTime': {
                return <SPDateTimeField fieldSchema={field} onChange={this.handleFieldChange} formMode={this.props.formType} isDateOnly={true} />;
              }
              case 'Lookup': {
                return (
                  <SPLookupField
                    fieldSchema={field}
                    formMode={this.props.formType}
                    context={this.props.context}
                    columnInternalName={field.LookupField}
                    listId={field.LookupList}
                    itemLimit={1}
                    onSelectedItem={null}
                    selectedItem={this.handleLookupChange}
                  />
                );
              }
              case 'LookupMulti': {
                return (
                  <SPLookupField
                    fieldSchema={field}
                    formMode={this.props.formType}
                    context={this.props.context}
                    columnInternalName={field.LookupField}
                    listId={field.LookupList}
                    itemLimit={100}
                    onSelectedItem={null}
                    selectedItem={this.handleLookupChange}
                  />
                );
              }
              default:
                return '#FFFFFF';
            }
          })()}
        </div>
      </div>
    );
  }
  private handleLookupChange = (val?, key?) => {
    console.log(`this is lookup handle change of key -> ${key}`);
    console.log(val);
    let temp = this.state.valueMap;
    if (val.length > 0) {
      switch (temp[key].fieldSchema.TypeAsString) {
        case 'Lookup': {
          temp[key].fieldValue = val[0].key;
          break;
        }
        case 'LookupMulti': {
          temp[key].fieldValue = {
            results: [] // allows multiple lookup value
          };
          val.map(v => {
            temp[key].fieldValue.results.push(v.key);
          });
          break;
        }
      }
    } else {
      delete temp[key].fieldValue;
    }
    // temp[key].fieldValue = val[0].key;
    this.setState({
      ...this.state,
      valueMap: temp
    });
    console.log(this.state);
  };
  private handleFieldChange = (val?, key?) => {
    console.log(`handleTextFieldChange: ${val} with key ${key}`);
    let temp = this.state.valueMap;
    temp[key].fieldValue = val;
    this.setState({
      ...this.state,
      valueMap: temp
    });
    console.log(this.state);
  };
  private handleMMDFieldChange = (val?, key?) => {
    let temp = this.state.valueMap;
    console.log(temp);
    if (val.length > 0) {
      val.map(term => {
        temp[key].fieldValue = {
          Label: term.name,
          TermGuid: term.key,
          WssId: '-1'
        };
      });
    } else {
      delete temp[key].fieldValue;
    }
    this.setState({
      ...this.state,
      valueMap: temp
    });
    console.log(this.state);
  };
  private handleUserFieldChange = (val?, key?) => {
    console.log(`this is User field handle change of key -> ${key}`);
    console.log(val);
    let temp = this.state.valueMap;
    if (val.length > 0) {
      switch (temp[key].fieldSchema.TypeAsString) {
        case 'User': {
          temp[key].fieldValue = val[0].id;
          break;
        }
        case 'UserMulti': {
          temp[key].fieldValue = {
            results: [] // allows multiple lookup value
          };
          val.map(v => {
            temp[key].fieldValue.results.push(v.id);
          });
          break;
        }
      }
    } else {
      delete temp[key].fieldValue;
    }
    // temp[key].fieldValue = val[0].key;
    this.setState({
      ...this.state,
      valueMap: temp
    });
    console.log(this.state);
    // tslint:disable-next-line: semicolon
  };
  private validateForm = () => {
    // Put validate logic
    let isValid: boolean = true;
    let values = {};
    const vals = Object.keys(this.state.valueMap).map(key => this.state.valueMap[key]);
    vals.map(v => {
      if (v.fieldSchema.Required && !v.fieldValue) {
        isValid = false;
        if (document.getElementById(v.fieldSchema.InternalName + '-error'))
          document.getElementById(v.fieldSchema.InternalName + '-error').classList.remove(styles.hideElement);
      } else {
        if (document.getElementById(v.fieldSchema.InternalName + '-error'))
          document.getElementById(v.fieldSchema.InternalName + '-error').classList.add(styles.hideElement);
      }
    });
    if (isValid) this.submitForm();
    else {
      console.log('Not Valid');
    }
  };
  private submitForm = () => {
    let values = {};
    const vals = Object.keys(this.state.valueMap).map(key => this.state.valueMap[key]);
    vals.map(v => {
      if (v.fieldValue) {
        console.log('This is the type of my field as string:');
        console.log(v.fieldSchema.TypeAsString);
        let appendId: Boolean = false;
        switch (v.fieldSchema.TypeAsString) {
          case 'Lookup': {
            appendId = true;
            break;
          }
          case 'LookupMulti': {
            appendId = true;
            break;
          }
          case 'User': {
            appendId = true;
            break;
          }
          case 'UserMulti': {
            appendId = true;
            break;
          }
        }
        console.log(`FieldVAlue: ${v.fieldSchema.InternalName}: `);
        console.log(v.fieldValue);
        if (v.fieldValue) {
          if (appendId) values[v.fieldSchema.InternalName + 'Id'] = v.fieldValue;
          else values[v.fieldSchema.InternalName] = v.fieldValue;
        }
      }
    });
    // values['Title'] = 'This is created by pnp';
    console.log(values);
    this.spService.createListItem(this.props.listId, values).then(() => {
      eval(this.props.postSaveCode);
      //  this.props.redirectUrl ? (window.location.href = this.props.redirectUrl) : (window.location.href = 'https://google.com');
    });
  };
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { RichText, IRichTextProps } from '@pnp/spfx-controls-react/lib/RichText';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

export interface ISPMLTRichFieldProps extends IRichTextProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMLTRichFieldFormState {
  value: string;
  isFirstLoad: boolean;
  showError: boolean;
}
export default class SPMLTRichField extends React.Component<ISPMLTRichFieldProps, ISPMLTRichFieldFormState> {
  constructor(props: ISPMLTRichFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
      isFirstLoad: true,
      showError: false
    };
  }
  public render(): React.ReactElement<ISPMLTRichFieldProps> {
    // let errorMessage;
    // if (this.state.showError) {
    //   errorMessage = (
    //     <div role='alert' id={this.props.fieldSchema.InternalName + '-error'}>
    //       <p className='ms-TextField-errorMessage errorMessage-203'>
    //         <span data-automation-id='error-message'>You can't leave this blank.</span>
    //       </p>
    //     </div>
    //   );
    // } else {
    //   errorMessage = (
    //     <div role='alert' className={styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
    //       <p className='ms-TextField-errorMessage errorMessage-203'>
    //         <span data-automation-id='error-message'>You can't leave this blank.</span>
    //       </p>
    //     </div>
    //   );
    // }
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <RichText className={styles.richMLT} value={this.state.value} onChange={text => this.onTextChange(text)} />
        {/* {errorMessage} */}
        <div role='alert' className={this.state.showError ? styles.fontRed : styles.hideElement} id={this.props.fieldSchema.InternalName + '-error'}>
          <p className='ms-TextField-errorMessage errorMessage-203'>
            <span data-automation-id='error-message'>You can't leave this blank.</span>
          </p>
        </div>
      </div>
    );
  }
  private onTextChange = (newText: string) => {
    var stripedHtml = newText.replace(/<[^>]+>/g, '');
    let isError = false;
    if (!this.state.isFirstLoad && !stripedHtml && this.props.fieldSchema.Required) {
      isError = true;
    } else {
      isError = false;
    }
    this.setState({
      value: newText,
      isFirstLoad: false,
      showError: isError
    });
    console.log(newText);
    this.props.onChange(!stripedHtml ? '' : newText, this.props.fieldSchema.Title);
    return newText;
  };
}

import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {RichText, IRichTextProps} from '@pnp/spfx-controls-react/lib/RichText';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPMLTRichFieldProps extends IRichTextProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPMLTRichFieldFormState {
  value: string;
}
export default class SPMLTRichField extends React.Component<ISPMLTRichFieldProps, ISPMLTRichFieldFormState> {
  constructor(props: ISPMLTRichFieldProps) {
    super(props);
    this.state = {
      value: this.props.fieldSchema.DefaultValue,
    };
  }
  public render(): React.ReactElement<ISPMLTRichFieldProps> {
    return <RichText className={styles.richMLT} value={this.state.value} onChange={text => this.onTextChange(text)} />;
  }
  private onTextChange = (newText: string) => {
    this.setState({
      value: newText,
    });
    console.log(newText);
    this.props.onChange(newText, this.props.fieldSchema.Title);
    return newText;
  }
}

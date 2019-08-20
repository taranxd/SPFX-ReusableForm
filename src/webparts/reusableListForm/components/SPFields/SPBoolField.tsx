import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import {Toggle, IToggleProps} from 'office-ui-fabric-react/lib/';
import {IFieldSchema} from '../../../../common/services/datatypes/RenderListData';
import {ControlMode} from '@pnp/sp';

export interface ISPBoolFieldProps extends IToggleProps {
  fieldSchema: IFieldSchema;
  formMode: ControlMode;
  onChange?: any;
  errorMessage?: any;
}
export interface ISPBoolFieldFormState {
  checked: boolean;
}

export default class SPBoolField extends React.Component<ISPBoolFieldProps, ISPBoolFieldFormState> {
  constructor(props: ISPBoolFieldProps) {
    super(props);
    this.state = {
      checked: Boolean(JSON.parse(props.fieldSchema.DefaultValue)),
    };
  }

  public render(): React.ReactElement<ISPBoolFieldProps> {
    return (
      <Toggle
        //disabled={this.state.disableToggle}
        checked={this.state.checked}
        label=""
        onText="Yes"
        offText="No"
        //onChange={Toggle}
        onChange={this._onChange}
        onFocus={() => console.log('onFocus called')}
        onBlur={() => console.log('onBlur called')}
      />
    );
  }
  private _onChange = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
    console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
    let chk = this.state.checked;
    if (chk) {
      chk = false;
    } else {
      chk = true;
    }
    this.setState({
      checked: chk,
    });
    console.log('This is the state:');
    console.log(this.state.checked);
  }
}

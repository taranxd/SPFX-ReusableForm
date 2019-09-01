import * as React from 'react';
import styles from '../ReusableListForm.module.scss';
import { Toggle, IToggleProps } from 'office-ui-fabric-react/lib/';
import { IFieldSchema } from '../../../../common/services/datatypes/RenderListData';
import { ControlMode } from '@pnp/sp';

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
    let tempChecked;
    if (props.fieldSchema.DefaultValue.toLowerCase() === 'true') {
      tempChecked = true;
    } else if (props.fieldSchema.DefaultValue.toLowerCase() === 'false') {
      tempChecked = false;
    } else {
      tempChecked = Boolean(JSON.parse(props.fieldSchema.DefaultValue));
    }
    this.state = {
      checked: tempChecked
    };
    this._onChange(null, tempChecked);
  }

  public render(): React.ReactElement<ISPBoolFieldProps> {
    return (
      <div id={this.props.fieldSchema.InternalName}>
        <Toggle
          //disabled={this.state.disableToggle}
          checked={this.state.checked}
          label=''
          onText='Yes'
          offText='No'
          //onChange={Toggle}
          onChange={this._onChange}
          onFocus={() => console.log('onFocus called')}
          onBlur={() => console.log('onBlur called')}
          key={this.props.fieldSchema.InternalName}
        />
      </div>
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
      checked: chk
    });
    this.props.onChange(checked.toString(), this.props.fieldSchema.Title);
    console.log('This is the state:');
    console.log(this.state.checked);
  };
}

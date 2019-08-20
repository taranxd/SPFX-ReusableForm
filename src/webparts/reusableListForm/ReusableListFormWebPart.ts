import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Version, DisplayMode} from '@microsoft/sp-core-library';
import {BaseClientSideWebPart} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
} from '@microsoft/sp-property-pane';

import * as strings from 'ReusableListFormWebPartStrings';
import ReusableListForm from './components/ReusableListForm';
import {IReusableListFormProps} from './components/IReusableListFormProps';
// import ListForm from './components/ListForm';
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import {
  PropertyFieldCodeEditor,
  PropertyFieldCodeEditorLanguages,
} from '@pnp/spfx-property-controls/lib/PropertyFieldCodeEditor';
import {sp} from '@pnp/sp';
import {ControlMode} from '../../common/datatypes/ControlMode';
import {IFieldConfiguration} from './components/IFieldConfiguration';
export interface IReusableListFormWebPartProps {
  title: string;
  description: string;
  listId: string;
  formType: ControlMode;
  itemId?: string;
  showUnsupportedFields: boolean;
  redirectUrl?: string;
  fields?: IFieldConfiguration[];
  jsCode?: string;
}

export default class ReusableListFormWebPart extends BaseClientSideWebPart<IReusableListFormWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    let itemId;
    if (this.properties.itemId) {
      itemId = Number(this.properties.itemId);
      if (isNaN(itemId)) {
        // if item Id is not a number we assume it is a query string parameter
        const urlParams = new URLSearchParams(window.location.search);
        itemId = Number(urlParams.get(this.properties.itemId));
      }
    }
    let element;
    if (this.properties.listId) {
      // show actual list form react component
      element = React.createElement(ReusableListForm, {
        inDesignMode: this.displayMode === DisplayMode.Edit,
        spHttpClient: this.context.spHttpClient,
        title: this.properties.title,
        description: this.properties.description,
        webUrl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        formType: this.properties.formType,
        id: itemId,
        fields: this.properties.fields,
        showUnsupportedFields: this.properties.showUnsupportedFields,
        onSubmitSucceeded: (id: number) => this.formSubmitted(id),
        onUpdateFields: (fields: IFieldConfiguration[]) => this.updateField(fields),
        context: this.context,
      });
    } else {
      //configure webpart screen
      element = React.createElement(ReusableListForm, {
        inDesignMode: this.displayMode === DisplayMode.Edit,
        spHttpClient: this.context.spHttpClient,
        title: this.properties.title,
        description: this.properties.description,
        webUrl: this.context.pageContext.web.absoluteUrl,
        listId: this.properties.listId,
        formType: this.properties.formType,
        id: itemId,
        fields: this.properties.fields,
        showUnsupportedFields: this.properties.showUnsupportedFields,
        onSubmitSucceeded: (id: number) => this.formSubmitted(id),
        onUpdateFields: (fields: IFieldConfiguration[]) => this.updateField(fields),
        context: this.context,
      });
    }
    // const element: React.ReactElement<IReusableListFormProps> = React.createElement(ReusableListForm, {
    //   description: this.properties.description
    // });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const mainGroup = {
      groupName: strings.BasicGroupName,
      groupFields: [
        PropertyPaneTextField('title', {
          label: strings.TitleFieldLabel,
        }),
        PropertyPaneTextField('description', {
          label: strings.DescriptionFieldLabel,
          multiline: true,
        }),
        PropertyFieldListPicker('listId', {
          label: 'Select a list',
          selectedList: this.properties.listId,
          includeHidden: false,
          orderBy: PropertyFieldListPickerOrderBy.Title,
          disabled: false,
          onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
          properties: this.properties,
          context: this.context,
          onGetErrorMessage: null,
          deferredValidationTime: 0,
          key: 'listPickerFieldId',
        }),
        PropertyPaneDropdown('formType', {
          label: strings.FormTypeFieldLabel,
          options: Object.keys(ControlMode)
            .map(k => ControlMode[k])
            .filter(v => typeof v === 'string')
            .map(n => ({key: ControlMode[n], text: n})),
          disabled: !this.properties.listId,
        }),
        PropertyFieldCodeEditor('htmlCode', {
          label: 'Edit JavaScript Code',
          panelTitle: 'Edit JavaScript Code',
          initialValue: this.properties.jsCode,
          onPropertyChange: this.onPropertyPaneFieldChanged,
          properties: this.properties,
          disabled: !this.properties.listId,
          key: 'codeEditorFieldId',
          language: PropertyFieldCodeEditorLanguages.HTML,
        }),
      ],
    };
    if (this.properties.formType !== ControlMode.New) {
      mainGroup.groupFields.push(
        PropertyPaneTextField('itemId', {
          label: strings.ItemIdFieldLabel,
          deferredValidationTime: 2000,
          description: strings.ItemIdFieldDescription,
        })
      );
    } else {
      this.properties.itemId = null;
    }

    mainGroup.groupFields.push(
      PropertyPaneToggle('showUnsupportedFields', {
        label: strings.ShowUnsupportedFieldsLabel,
        disabled: !this.properties.listId,
      })
    );
    mainGroup.groupFields.push(
      PropertyPaneTextField('redirectUrl', {
        label: strings.RedirectUrlFieldLabel,
        description: strings.RedirectUrlFieldDescription,
        disabled: !this.properties.listId,
      })
    );
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [mainGroup],
        },
      ],
    };
  }

  private updateField(fields: IFieldConfiguration[]): any {
    this.properties.fields = fields;
    // render web part again so that React List Form component is rerendered with changed fields
    this.render();
  }

  private formSubmitted(id: number) {
    if (this.properties.redirectUrl) {
      // redirect to configured URL after successfully submitting form
      window.location.href = this.properties.redirectUrl.replace('[ID]', id.toString());
    }
  }
}

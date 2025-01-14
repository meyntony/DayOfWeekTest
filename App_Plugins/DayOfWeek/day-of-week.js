import { html } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element'
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";

export class DayOfWeekSelector extends UmbLitElement {
  static properties = {
    value: {type: Number},
    list: {type: Array},
    displayList: {type: Array},
  };
  value = 0;
  displayList = [];
  list = [];
  defaultStartDayOfWeekValue = 3;
  

  connectedCallback() {
      super.connectedCallback();
      this.defaultStartDayOfWeekValue = this.config.find(i => i.alias === 'defaultStartDayOfWeek')?.value || this.defaultStartDayOfWeekValue;
    // fetch(`/umbraco/backoffice/UmbracoDayOfWeek/DayOfWeekApi/GetKeyValueList?defaultDayOfWeek?${this.defaultStartDayOfWeekValue}`).then(res=>res.json()).then(results => {
    Promise.resolve([{Id:0,DefaultName:'untranslated_sunday'},{Id:1,DefaultName:'untranslated_monday'},{Id:2,DefaultName:'untranslated_tuesday'},{Id:3,DefaultName:'untranslated_wednesday'},{Id:4,DefaultName:'untranslated_thursday'},{Id:5,DefaultName:'untranslated_friday'},{Id:6,DefaultName:'untranslated_saturdayday'}]).then(results => {
      this.list = results; 
      this.mapList();
    });
  }

  mapList() {
    this.displayList = this.list.map(item => ({
      name: this.localize.term(`dayOfWeek_d${item.Id}`) || item.DefaultName, 
      value: +item.Id,
      selected: +this.value === item.Id
    }));
    this.requestUpdate();
  }

  #onChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
    this.mapList();
  }

  render() {
    return html`<uui-select 
                  .options=${this.displayList} 
                  @change=${this.#onChange}></uui-select>`;
  }
}
customElements.define('day-of-week-selector', DayOfWeekSelector);
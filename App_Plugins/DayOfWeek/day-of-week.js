import { html } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element'
import { UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
export class DayOfWeekSelector extends UmbLitElement {
	static properties = {
		value: { type: Number },
		list: { type: Array },
		displayList: { type: Array },
		myAuthToken: { type: String }
	};
	myAuthToken = "";
	value = -1;
	displayList = [];
	list = [];
	defaultStartDayOfWeekValue = 3;


	connectedCallback() {
		super.connectedCallback();
		console.log("Hello");
		this.defaultStartDayOfWeekValue = this.config.find(i => i.alias === 'defaultStartDayOfWeek')?.value || this.defaultStartDayOfWeekValue;
		this.consumeContext(UMB_AUTH_CONTEXT, (context) => {
			context.getLatestToken().then(promiseToken => {
				try {
					const headers = {
						'Authorization': `Bearer ${promiseToken}`
					};
					fetch(`/umbraco/management/api/v1/get-dropdown-value-list?startDayOfTheWeek=${this.defaultStartDayOfWeekValue}`, { headers }).then(response => response.json())
						.then(results => {
							this.list = results;
							this.mapList();
						})

				} catch (e) {
					console.error(e);
				}
			});
		});
	}

	mapList() {
		this.displayList = this.list.map(item => ({
			name: this.localize.term(`dayOfWeek_d${item.id}`) || item.DefaultName,
			value: +item.id,
			selected: +this.value === item.id
		}));
		this.requestUpdate();
	}

	#onChange(e) {
		this.value = +e.target.value;
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
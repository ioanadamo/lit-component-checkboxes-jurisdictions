
import {LitElement, html, css} from 'lit';

import { DmGetJurisdictionsCircuits } from './data/data-manager/dm-get-jurisdictions-circuits.js'

import { groupAndSort } from './utils/functions.js';

export class SelectJurisdictionCircuits extends LitElement {
  static get styles() {
    return css`
        .container-elements {
          display: grid;
          grid-template-columns: 1fr 0.5fr 1fr;
          grid-column-gap: 20px;
        }

        .list-selected-circuitrs {
          list-style: circle;
        }

        .jurisdictions {
          margin-left: 10px;
        }

        .title-section {
          text-transform: capitalize;
        }

        .jurisdictions-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 20px;
        }

        .circuits-section {
          display: grid;
        }

        .round-border {
          border: 1px solid black;
          border-radius: 10px;
          padding: 10px;
        }
    `;
  }

  static get properties() {
    return {
      _circuits: {type: Array},
      _jurisdictions: {type: Array},
      _nameCircuits: {type: String},
      _nameJurisdictions: {type: String},
      _selectedJurisdiction: {type: Array},
      _selectedCircuits: {type: Array},
    };
  }

  constructor() {
    super();
    this._circuits = new Set();
    this._jurisdictions = new Set();
    this._selectedJurisdiction = [];
    this._selectedCircuits = [];
    this._nameCircuits = "circuits"
    this._nameJurisdictions = "jurisdictions"
    this.preSelectededJurisdictions = [
      "California", "New York"
    ]
    this._setData()
  }

  firstUpdated() {
    this._setPreSelectedJuridictions()
  }

  _setData() {
    const dmDataJurisdictionsCircuits = new DmGetJurisdictionsCircuits()

    this._jurisdictions = dmDataJurisdictionsCircuits.getJurisdictions()
    this._circuits = dmDataJurisdictionsCircuits.getCircuits()
  }

  _setPreSelectedJuridictions() {
    const checkBoxesJurisdictions = Array.from(this.shadowRoot.querySelectorAll("form[name=jurisdictions] > label> input"))

    checkBoxesJurisdictions.forEach(checkBox => {
      const valueCheckbox = JSON.parse(checkBox.value)
      const isSelectedCircuit = this.preSelectededJurisdictions.some(jurisdiction => jurisdiction === valueCheckbox.name)
      checkBox.checked = isSelectedCircuit

      this._handleCheckboxChangeJurisdictions(checkBox)  
    })
  }

  _handleCheckboxChangeJurisdictions(element) {
    const { value, checked } = element.target ? element.target : element
    const parsedValue = JSON.parse(value)

    if (checked) {
      this._selectedJurisdiction = [...this._selectedJurisdiction, parsedValue];
      this._selectedJurisdiction = this._filteredDuplicateJuristidctions()
    } else {
      this._selectedJurisdiction = this._selectedJurisdiction.filter(value => value.name !== parsedValue.name);
    }
    
    this.emmitSelectedJurisdictions()
  }

  _filteredDuplicateJuristidctions() {
    return this._selectedJurisdiction.filter((item, index, arr) => {
      return arr.findIndex(obj => obj.name === item.name && obj.circuit === item.circuit) === index;
    });
  }

  _handleCheckboxChangeCircuits(event) {
    const { value, checked } = event.target
    const parsedValue = JSON.parse(value)

    if (checked) {
      this._selectedCircuits = [...this._selectedCircuits, parsedValue];
    } else {
      this._selectedCircuits = this._selectedCircuits.filter(valueSelected =>  valueSelected.name !== parsedValue.name );
    }

    this._setCheckedJurisdictions(event.target)
  }

  _setCheckedJurisdictions(selectedCircuit) {
    const checkBoxesJurisdictions = Array.from(this.shadowRoot.querySelectorAll("form[name=jurisdictions] > label > input"))
    const selectedCircuitValue = JSON.parse(selectedCircuit.value) 
    
    checkBoxesJurisdictions.forEach(checkBox => {
      const valueCheckbox = JSON.parse(checkBox.value)
      const isSelectedCircuit = this._selectedCircuits.some(circuit => circuit.value.includes(valueCheckbox.name))

      if(selectedCircuit.checked) {
        checkBox.checked = isSelectedCircuit
      }
      else {
        checkBox.checked = !selectedCircuitValue.value.includes(valueCheckbox.name) && isSelectedCircuit
      }

      this._handleCheckboxChangeJurisdictions(checkBox)  
    })
  }

  emmitSelectedJurisdictions() {
    this.dispatchEvent(new CustomEvent('jurisdictions-selected', {
      detail: this._selectedJurisdiction,
      bubbles: true,
      composed: true
    }));
  }

  get _circuitsTemplate() {
    return html`
    <div>
      <p class="title-section">${this._nameCircuits}</p>
      <form name="${this._nameCircuits}" class="circuits-section round-border">
      ${
        this._circuits.map(element => {
          return html`
            <label>
              <input 
                type="checkbox"
                value="${JSON.stringify(element)}"
                @change=${this._handleCheckboxChangeCircuits}
              > 
            Circuit ${element.name} 
            </label>
          `
        })
      }
      </form>
    </div>
    `
  }

  get _jurisdictionsTemplate() {
    return html`
    <div>
      <p class="title-section">${this._nameJurisdictions}</p>
      <form name="${this._nameJurisdictions}" class="jurisdictions-section round-border">
      ${
        this._jurisdictions.map(element => {
          return html`
            <label> 
              <input 
                type="checkbox"
                value="${element.value}"
                @change=${this._handleCheckboxChangeJurisdictions}
              > 
            ${element.name}
            </label>
          `
        })
      }
      </form>
    </div>
    `
  }

  get _selectedJurisdictions() {
    const circuitsJurisdictions = this._selectedJurisdiction.length > 0 ? groupAndSort(this._selectedJurisdiction) : []

    return circuitsJurisdictions.length > 0 ? html`
      <p>
        Selected Circuits:
      </p>
      <ul class="list-selected-circuitrs">
      ${circuitsJurisdictions.map(circuit => html`
        <li>
          Circuit: ${circuit.name}
            <p class="jurisdictions"> > Jurisdictions: ${circuit.value.join(', ')}</p>
        </li>
      `)}
      </ul>
    `:""
  }

  handleCircuitCheckboxChange() {
    const circuit = circuitCheckbox.checked ? circuitCheckbox.value : null;
    const statesInCircuit = circuit ? data.filter(state => state.circuit === circuit) : [];
    generateStateCheckboxes(statesInCircuit);
  }

  render() {
    return html`
      <div>
        <p class="title-component">
          Select Juridictions and circuits
        </p>
        <div class="container-elements">
          ${this._jurisdictionsTemplate}
          ${this._circuitsTemplate}
        </div>
        <div class="container-selected-elements">
          ${this._selectedJurisdictions}
        </div>
      </div>
    `;
  }

}

window.customElements.define('select-jurisdiction-circuits', SelectJurisdictionCircuits);

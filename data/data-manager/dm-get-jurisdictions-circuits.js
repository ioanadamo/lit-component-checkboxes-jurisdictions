/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';

import dataSource from '../source/jurisdictions-circuits.js'
import { groupAndSort } from '../../../utils/functions.js'

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class DmGetJurisdictionsCircuits extends LitElement {

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  getJurisdictions() {
    const jursdictions = dataSource.states.map(item => { 
      return {
        "name": item.name, 
        "value": JSON.stringify(item)
      }
    })

    return jursdictions;
  }

  customSort(a, b) {
    console.log(a)
    console.log(b)
    const nameA = parseInt(a.name);
    const nameB = parseInt(b.name);
    
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }

  getCircuits() {
    const circuits = groupAndSort(dataSource.states)

    return circuits;
  }
}

window.customElements.define('dm-get-jurisdictions-circuits', DmGetJurisdictionsCircuits);

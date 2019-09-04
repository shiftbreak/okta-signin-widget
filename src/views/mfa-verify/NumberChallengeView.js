/*!
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

define([
  'okta',
], function (Okta) {

  return Okta.View.extend({
    className: 'number-challenge-view',
    template: `
      <p class="explain">On your phone tap, {{number}} on Okta Verify prompt to continue.</p>
      <div class="phone">
        <div class="phone--body">
          <div class="phone--screen">
            <span class="phone--number">{{number}}</span>
          </div>
          <div class="phone--home-button"></div>
        </div>        
      </div>
      <p class="explain">This extra step helps us makge sure it's really you signing in.</p>
    `,
    initialize () {
      this.listenTo(this.options.appState, 'change:isWaitingForNumberChallenge', this.render);
    },
    getTemplateData () {
      const lastAuthResponse = this.options.appState.get('lastAuthResponse');
      if (!this.options.appState.get('isWaitingForNumberChallenge')) {
        return {
          number: null
        };
      }
      return {
        number: lastAuthResponse._embedded.factor._embedded.challenge.correctAnswer,
      };
    } 
  });

});
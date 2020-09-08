/*!
 * Copyright (c) 2020, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import hbs from 'handlebars-inline-precompile';
import { _, View, loc } from 'okta';
import FormController from 'util/FormController';
import FormType from 'util/FormType';
import ScopeList from 'views/admin-consent/ScopeList';

const ConsentModel = {
  props: {
    scopes: ['array', true]
  },
  save: function () {
    return this.doTransaction(function (transaction) {
      return transaction.consent({
        consent: {
          scopes: _.pluck(this.get('scopes'), 'name')
        }
      });
    });
  },
  cancel: function () {
    var self = this;
    return this.doTransaction(function (transaction) {
      return transaction.cancel();
    }).then(function () {
      var consentCancelFn = self.settings.get('consent.cancel');
      if (_.isFunction(consentCancelFn)) {
        consentCancelFn();
      }
    });
  }
};

const ConsentHeader = View.extend({
  className: 'consent-title detail-row',
  template: hbs`
    {{#if clientURI}}
     <a href="{{clientURI}}" class="client-logo-link" target="_blank">
    {{/if}}
    {{#if customLogo}}
      <img class="client-logo custom-logo" src="{{customLogo}}" />
    {{else}}
      <img class="client-logo default-logo" src="{{defaultLogo}}" />
    {{/if}}
    {{#if clientURI}}
      </a>
    {{/if}}
    <span class="title-text">{{{i18n code="consent.required.text" bundle="login" arguments="appName"}}}</span>
    <div class="issuer"><span>{{issuer}}</span></div>
   `,
  getTemplateData: function () {
    var appState = this.options.appState;
    return {
      appName: appState.escape('targetLabel'),
      customLogo: appState.get('targetLogo') && appState.get('targetLogo').href,
      defaultLogo: appState.get('defaultAppLogo'),
      clientURI: appState.get('targetClientURI') && appState.get('targetClientURI').href,
      issuer: appState.get('issuer'),
    };
  }
});

const ConsentForm = {
  noCancelButton: false,
  autoSave: true,
  save: _.partial(loc, 'consent.required.consentButton', 'login'),
  cancel: _.partial(loc, 'consent.required.cancelButton', 'login'),
  formChildren: [
    FormType.View({
      View: ConsentHeader
    }),
    FormType.View({
      View: ScopeList,
    }),
  ],
};

const AdminConsentRequiredController = FormController.extend({
  Model: ConsentModel,

  Form: ConsentForm,

  className: 'admin-consent-required',

  initialize: function () {
    this.model.set('scopes', this.options.appState.get('scopes'));
    this.listenTo(this.form, 'cancel', () => {
      this.model.cancel();
    });
  },
});

module.exports = AdminConsentRequiredController;

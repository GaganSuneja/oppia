// Copyright 2016 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview End-to-end tests for collections.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var AdminPage = require('../protractor_utils/AdminPage.js');
var CollectionEditorPage = require('../protractor_utils/CollectionEditorPage.js');


describe('Collections', function() {
  var adminPage = null;

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    var USERNAME = 'aliceCollections';
    users.createUser('alice@collections.com', USERNAME);
    users.createAndLoginAdminUser('testadm@collections.com', 'testadm');
    adminPage.get();
    adminPage.reloadCollection();
    general.acceptAlert();
    browser.waitForAngular();
    adminPage.reloadAllExplorations();
    adminPage.updateRole(USERNAME, 'collection editor');
    users.logout();
  });

  it('visits the collection editor', function() {
    users.login('alice@collections.com');
    browser.get(general.SERVER_URL_PREFIX);
    var dropdown = element(by.css('.protractor-test-profile-dropdown'));
    browser.actions().mouseMove(dropdown).perform();
    dropdown.element(by.css('.protractor-test-dashboard-link')).click();
    browser.waitForAngular();
    element(by.css('.protractor-test-create-activity')).click();
    // Create new collection.
    element(by.css('.protractor-test-create-collection')).click();
    browser.waitForAngular();
    // Add existing explorations.
    CollectionEditorPage.addExistingExploration('0');
    CollectionEditorPage.addExistingExploration('4');
    CollectionEditorPage.addExistingExploration('13');
    // Search and add existing explorations.
    CollectionEditorPage.searchForAndAddExistingExploration('Lazy');
    CollectionEditorPage.searchForAndAddExistingExploration('Linear');
    CollectionEditorPage.searchForAndAddExistingExploration('The');
    // Shifting nodes in the node graph.
    CollectionEditorPage.shiftNodeLeft(1);
    CollectionEditorPage.shiftNodeRight(1);
    // Delete node in the node graph.
    CollectionEditorPage.deleteNode(1);
    // Publish the collection.
    CollectionEditorPage.saveDraft();
    CollectionEditorPage.closeSaveModal();
    CollectionEditorPage.publishCollection();
    CollectionEditorPage.setTitle('Test Collection');
    CollectionEditorPage.setObjective('This is a test collection.');
    CollectionEditorPage.setCategory('Algebra');
    CollectionEditorPage.saveChanges();
    browser.waitForAngular();
    users.logout();
  });

  it('visits the collection player', function() {
    users.login('alice@collections.com');
    browser.get('/collection/0');
    browser.waitForAngular();
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

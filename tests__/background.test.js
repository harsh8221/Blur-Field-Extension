// __tests__/background.test.js

const fs = require('fs');
const path = require('path');

// Load and execute the background script code
const backgroundScript = fs.readFileSync(path.resolve(__dirname, '../background.js'), 'utf8');
eval(backgroundScript);

describe('Background Script', () => {
  test('onCommand listener sends message when blur_everything command is received', () => {
    // Mock chrome.tabs.query and chrome.tabs.sendMessage
    chrome.tabs.query.mockImplementation((queryInfo, callback) => {
      callback([{ id: 1 }]); // Mock tab with id 1
    });
    chrome.tabs.sendMessage = jest.fn();

    // Retrieve the onCommand listener function
    const listener = chrome.commands.onCommand.addListener.mock.calls[0][0];

    // Call the listener with the 'blur_everything' command
    listener('blur_everything');

    // Check that chrome.tabs.sendMessage was called with the correct parameters
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, { action: 'blur_everything' });
  });
});

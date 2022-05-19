import { onClickHandler } from './handlers/onClick';
import log from 'loglevel';
import { DEFAULT_LOG_LEVEL } from './config';

log.setLevel(DEFAULT_LOG_LEVEL);

chrome.action.onClicked.addListener(onClickHandler());

// chrome.tabs.onUpdated.addListener(attachToDebugger);

// chrome.runtime.onMessage.addListener(onMessageHandler());

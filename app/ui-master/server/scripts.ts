import crypto from 'crypto';

import { SimpleHandleFunction } from 'connect';
import { WebApp } from 'meteor/webapp';
import { debounce } from 'underscore';

import { settings } from '../../settings/server';
import { injectIntoHead } from './inject';


const getContent = (): string => `
${ process.env.DISABLE_ANIMATION ? 'window.DISABLE_ANIMATION = true;\n' : '' }

${ settings.get('API_Use_REST_For_DDP_Calls') ? 'window.USE_REST_FOR_DDP_CALLS = true;\n' : '' }

// Custom_Script_Logged_Out
window.addEventListener('Custom_Script_Logged_Out', function() {
	${ settings.get('Custom_Script_Logged_Out') }
})


// Custom_Script_Logged_In
window.addEventListener('Custom_Script_Logged_In', function() {
	${ settings.get('Custom_Script_Logged_In') }
})


// Custom_Script_On_Logout
window.addEventListener('Custom_Script_On_Logout', function() {
	${ settings.get('Custom_Script_On_Logout') }
})

${ settings.get('Accounts_ForgetUserSessionOnWindowClose') ? `
window.addEventListener('load', function() {
	if (window.localStorage) {
		Object.keys(window.localStorage).forEach(function(key) {
			window.sessionStorage.setItem(key, window.localStorage.getItem(key));
		});
		window.localStorage.clear();
		Meteor._localStorage = window.sessionStorage;
	}
});
` : '' }`;

settings.get(/(API_Use_REST_For_DDP_Calls|Custom_Script_Logged_Out|Custom_Script_Logged_In|Custom_Script_On_Logout|Accounts_ForgetUserSessionOnWindowClose)/, debounce(() => {
	const currentHash = crypto.createHash('sha1').update(getContent()).digest('hex');
	injectIntoHead('scripts', `<script type="text/javascript" src="/js/scripts.js?${ currentHash }"></script>`);
}, 1000));

const callback: SimpleHandleFunction = (_, res): void => {
	res.setHeader('Content-Type', 'application/javascript');
	res.write(getContent());
	res.end();
};

WebApp.connectHandlers.use('/js/scripts.js', callback);

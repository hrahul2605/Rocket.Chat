import { Box } from '@rocket.chat/fuselage';
import React from 'react';

import CannedResponseAdd from './CannedResponseAdd';

export default {
	title: 'omnichannel/CannedResponse/CannedResponseAdd',
	component: CannedResponseAdd,
};

export const Default = () => (
	<Box maxWidth='x300' alignSelf='center' w='full'>
		<CannedResponseAdd />
	</Box>
);

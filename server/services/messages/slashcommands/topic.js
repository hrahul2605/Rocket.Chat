import { Meteor } from 'meteor/meteor';

import { handleError, slashCommands } from '../../../../app/utils';
import { ChatRoom } from '../../../models';
import { callbacks } from '../../../../app/callbacks';
import { hasPermission } from '../../../../app/authorization';

function Topic(command, params, item) {
	if (command === 'topic') {
		if ((Meteor.isClient && hasPermission('edit-room', item.rid)) || (Meteor.isServer && hasPermission(Meteor.userId(), 'edit-room', item.rid))) {
			Meteor.call('saveRoomSettings', item.rid, 'roomTopic', params, (err) => {
				if (err) {
					if (Meteor.isClient) {
						return handleError(err);
					}
					throw err;
				}

				if (Meteor.isClient) {
					callbacks.run('roomTopicChanged', ChatRoom.findOne(item.rid));
				}
			});
		}
	}
}

slashCommands.add('topic', Topic, {
	description: 'Slash_Topic_Description',
	params: 'Slash_Topic_Params',
	permission: 'edit-room',
});

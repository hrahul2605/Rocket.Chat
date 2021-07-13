import { Box } from '@rocket.chat/fuselage';
import { useResizeObserver } from '@rocket.chat/fuselage-hooks';
import React, { useRef, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useSession } from '../../contexts/SessionContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { useUserPreference, useUserId } from '../../contexts/UserContext';
import { useAvatarTemplate } from '../hooks/useAvatarTemplate';
import { usePreventDefault } from '../hooks/usePreventDefault';
import { useRoomList } from '../hooks/useRoomList';
import { useShortcutOpenMenu } from '../hooks/useShortcutOpenMenu';
import { useSidebarPaletteColor } from '../hooks/useSidebarPaletteColor';
import { useTemplateByViewMode } from '../hooks/useTemplateByViewMode';
import GlobalVoiceController from './GlobalVoiceController';
import Row from './Row';
import ScrollerWithCustomProps from './ScrollerWithCustomProps';

const RoomList = () => {
	useSidebarPaletteColor();
	const listRef = useRef();
	const { ref } = useResizeObserver({ debounceDelay: 100 });

	const openedRoom = useSession('openedRoom');

	const sidebarViewMode = useUserPreference('sidebarViewMode');
	const sideBarItemTemplate = useTemplateByViewMode();
	const avatarTemplate = useAvatarTemplate();
	const extended = sidebarViewMode === 'extended';
	const isAnonymous = !useUserId();

	const t = useTranslation();

	const roomsList = useRoomList();
	const itemData = useMemo(
		() => ({
			extended,
			t,
			SideBarItemTemplate: sideBarItemTemplate,
			AvatarTemplate: avatarTemplate,
			openedRoom,
			sidebarViewMode,
			isAnonymous,
		}),
		[avatarTemplate, extended, isAnonymous, openedRoom, sideBarItemTemplate, sidebarViewMode, t],
	);

	usePreventDefault(ref);
	useShortcutOpenMenu(ref);

	useEffect(() => {
		listRef.current?.resetAfterIndex(0);
	}, [sidebarViewMode]);

	return (
		<Box h='full' w='full' ref={ref} position='relative'>
			<Virtuoso
				totalCount={roomsList.length}
				data={roomsList}
				components={{ Scroller: ScrollerWithCustomProps }}
				itemContent={(index, data) => <Row data={itemData} item={data} />}
			/>
			<Box position='absolute' style={{ bottom: 0, left: 0, right: 0, zIndex: 10 }}>
				<GlobalVoiceController />
			</Box>
		</Box>
	);
};

export default RoomList;

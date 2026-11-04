import { createStoreContext } from '@/shared/lib'
import type { NotificationsState } from './store'

const context = createStoreContext<NotificationsState>('Notifications')

export const NotificationsStoreProvider = context.Provider
export const useNotifications = context.useSelector
export const useNotificationsStoreApi = context.useStoreApi

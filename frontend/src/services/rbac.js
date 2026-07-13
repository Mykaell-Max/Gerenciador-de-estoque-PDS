import { MENU_ITEMS } from '../constants/roles'

export function canAccess(role, screen) {
  const item = MENU_ITEMS.find(m => m.key === screen)
  return item ? item.roles.includes(role) : false
}

export function menuItems(role) {
  return MENU_ITEMS.map(item => ({
    ...item,
    allowed: item.roles.includes(role),
  }))
}

export function initialScreen(role) {
  const item = MENU_ITEMS.find(m => m.roles.includes(role))
  return item?.key ?? "dashboard"
}

import { Navigation } from "decky-frontend-lib";

export let SETTINGS_ROUTE = "/speedtest/settings";
export let VIEW_ALL_TESTS = "/speedtest/view-all-tests";

export function navigateToPage(url: string) {
  Navigation.CloseSideMenus();
  Navigation.Navigate(url);
}

export function navigateBack() {
  Navigation.CloseSideMenus();
  Navigation.NavigateBack();
}

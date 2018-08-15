import Strings from '@/constants/strings';

const htrStorage = {
  settingDefaults() {
    return {
      theme: 'one'
    };
  },
  getSettings() {
    return (
      JSON.parse(localStorage.getItem(Strings.localStorageKey)) ||
      this.settingDefaults()
    );
  },
  saveSettings(newValues) {
    const values = this.getSettings();
    const updated = { ...values, ...newValues };
    localStorage.setItem(Strings.localStorageKey, JSON.stringify(updated));
    return updated;
  }
};

export const getTheme = () => htrStorage.getSettings().theme;
export const saveTheme = (theme) => htrStorage.saveSettings({ theme }).theme;

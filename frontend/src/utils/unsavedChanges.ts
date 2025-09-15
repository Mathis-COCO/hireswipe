let _hasUnsaved = false;

export const setHasUnsavedChanges = (v: boolean) => {
  _hasUnsaved = !!v;
};

export const hasUnsavedChanges = (): boolean => _hasUnsaved;

const unsaved = { setHasUnsavedChanges, hasUnsavedChanges };
export default unsaved;

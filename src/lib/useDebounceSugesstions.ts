import debounce from "debounce";

export const useDebounceSuggestions = (fetchSuggestions: any) => {
  return debounce(fetchSuggestions, 500);
};

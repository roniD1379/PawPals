export const getSelectedText = (id: string) => {
  const element = document.getElementById(id) as HTMLSelectElement;
  return element?.options[element?.selectedIndex].text;
};

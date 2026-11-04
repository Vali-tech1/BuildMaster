export type Artikull = {
  id: string;
  titulli: string;
  pershkrimi: string;
};

export const artikujt: Artikull[] = [
  {
    id: "expo-router",
    titulli: "Navigimi me Expo Router",
    pershkrimi:
      "Expo Router organizon ekranet e aplikacionit sipas strukturës së skedarëve.",
  },
  {
    id: "react-native",
    titulli: "React Native",
    pershkrimi:
      "React Native të ndihmon të krijosh aplikacione mobile për Android dhe iOS.",
  },
  {
    id: "typescript",
    titulli: "TypeScript",
    pershkrimi:
      "TypeScript shton kontrolle tipesh që ndihmojnë në zbulimin e gabimeve gjatë zhvillimit.",
  },
];

export function gjeArtikullin(id: string): Artikull | undefined {
  return artikujt.find((artikulli) => artikulli.id === id);
}

import { gjeArtikullin } from "@/data/artikujt";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Detajet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artikulli = gjeArtikullin(id);

  if (!artikulli) {
    return (
      <View style={styles.container}>
        <Text>Artikulli nuk u gjet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulli}>{artikulli.titulli}</Text>
      <Text style={styles.pershkrimi}>{artikulli.pershkrimi}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulli: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  pershkrimi: {
    fontSize: 16,
    lineHeight: 24,
  },
});

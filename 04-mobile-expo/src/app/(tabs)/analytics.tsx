import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { AnalyticsScreen as default } from '@/features/analytics';`
export default function AnalyticsScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>Analytics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { DashboardScreen as default } from '@/features/dashboard';`
export default function DashboardRoute() {
  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

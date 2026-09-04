import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { ProfileScreen as default } from '@/features/settings';`
export default function ProfileScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

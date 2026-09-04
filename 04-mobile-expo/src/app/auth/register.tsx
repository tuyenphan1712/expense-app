import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { RegisterScreen as default } from '@/features/auth';`
export default function RegisterScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>Register</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

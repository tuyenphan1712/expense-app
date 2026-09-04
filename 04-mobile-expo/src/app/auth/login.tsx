import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { LoginScreen as default } from '@/features/auth';`
export default function LoginScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

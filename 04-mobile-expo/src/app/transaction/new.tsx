import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { TransactionNewScreen as default } from '@/features/transaction';`
export default function TransactionNewScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>New Transaction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

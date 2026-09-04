import { StyleSheet, Text, View } from 'react-native';

// TODO: replace with `export { TransactionHistoryScreen as default } from '@/features/transaction';`
export default function TransactionHistoryScreenRoute() {
  return (
    <View style={styles.container}>
      <Text>History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

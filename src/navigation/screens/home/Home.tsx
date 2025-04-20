import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { styles } from './home.style';

import NAVIGATION_DATA from '../../../constants/navigation.json';

export function Home() {
  console.log('Home screen');
  console.log('NAVIGATION_DATA', NAVIGATION_DATA);
  return (
    <View style={styles.container}>
      <Text>Welcome to Finance Calculator</Text>
      {/* <Text>Open up 'src/App.tsx' to start working on your app!</Text> */}
      {/* <Button screen="Profile" params={{ user: 'jane' }}>
        Go to Profile
      </Button> */}
      <Button screen="MutualFunds">Mutual Funds Calculator</Button>
    </View>
  );
}

import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TopSheet } from './TopSheet';
import { useCallback, useMemo, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
    console.log('handleExpandPress');
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleExpandPress}
          style={[styles.button, styles.expandButton]}
        >
          <Text style={styles.buttonText}>Expand</Text>
        </Pressable>
        <Pressable
          onPress={handleCollapsePress}
          style={[styles.button, styles.collapseButton]}
        >
          <Text style={styles.buttonText}>Collapse</Text>
        </Pressable>
        <Pressable
          onPress={handleClosePress}
          style={[styles.button, styles.closeButton]}
        >
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>
      <TopSheet bottomSheetRef={bottomSheetRef} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Text>Hello from TopSheet!</Text>
          <Text>This sheet slides down from the top</Text>
          <Text>Swipe up to dismiss</Text>
        </View>
      </TopSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 1000
  },
  button: {
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center'
  },
  expandButton: {
    backgroundColor: 'green'
  },
  collapseButton: {
    backgroundColor: 'orange'
  },
  closeButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});

export default App;

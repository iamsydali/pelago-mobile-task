import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface TopSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet> | null;
  snapPoints: (string | number)[];
  children: React.ReactNode;
}

export const TopSheet = ({ bottomSheetRef, snapPoints, children }: TopSheetProps) => {
  // Convert snap points to be measured from top
  const topSnapPoints = useMemo(() => {
    return snapPoints.map(point => {
      if (typeof point === 'string') {
        // Convert percentage to inverse (e.g., '50%' becomes '50%' from top)
        return point;
      }
      // Convert absolute value to measure from top
      return SCREEN_HEIGHT - (point as number);
    });
  }, [snapPoints]);

  // Create animated styles for the container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: '180deg' },
      ],
    };
  });

  // Style to flip the content back
  const contentStyle = useMemo(() => ({
    transform: [{ rotate: '180deg' }],
  }), []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={topSnapPoints}
          enablePanDownToClose={true}
          style={styles.bottomSheet}
        >
          <BottomSheetView style={[styles.contentContainer, contentStyle]}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  animatedContainer: {
    flex: 1,
  },
  bottomSheet: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  }
});

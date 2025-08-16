import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export interface TopSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: (string | number)[];
  children: React.ReactNode;
}

export const TopSheet = ({ bottomSheetRef, snapPoints, children }: TopSheetProps) => {
  const currentSnapIndex = useSharedValue(0);
  const gestureTranslateY = useSharedValue(0);
  const isGestureActive = useSharedValue(false);

  const invertedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: -1 }]
    };
  });

  const snapToIndex = useCallback(
    (index: number) => {
      if (bottomSheetRef.current) {
        if (index === -1) {
          bottomSheetRef.current.close();
        } else if (index >= 0 && index <= snapPoints.length) {
          bottomSheetRef.current.snapToIndex(index);
        }
      }
    },
    [bottomSheetRef, snapPoints]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onUpdate(event => {
      gestureTranslateY.value = event.translationY;
    })
    .onEnd(event => {
      isGestureActive.value = false;
      gestureTranslateY.value = 0;

      const { translationY, velocityY } = event;
      const threshold = 50;
      const velocityThreshold = 500;

      let targetIndex = currentSnapIndex.value;

      if (
        Math.abs(translationY) > threshold ||
        Math.abs(velocityY) > velocityThreshold
      ) {
        if (translationY > 0 || velocityY > velocityThreshold) {
          targetIndex = Math.min(currentSnapIndex.value + 1, snapPoints.length);
        } else if (translationY < 0 || velocityY < -velocityThreshold) {
          targetIndex = Math.max(currentSnapIndex.value - 1, 0);
        }
      }

      if (targetIndex !== currentSnapIndex.value) {
        currentSnapIndex.value = targetIndex;
        runOnJS(snapToIndex)(targetIndex);
      }
    });

  const handleSheetChange = useCallback(
    (index: number) => {
      currentSnapIndex.value = index;
    },
    [currentSnapIndex]
  );

  return (
    <Animated.View style={[styles.topSheetContainer, invertedContainerStyle]}>
      <GestureDetector gesture={panGesture}>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          style={styles.bottomSheet}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          onChange={handleSheetChange}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Animated.View style={[invertedContainerStyle, styles.content]}>
              {children}
            </Animated.View>
          </BottomSheetView>
        </BottomSheet>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topSheetContainer: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  gestureContainer: {
    flex: 1
  },
  bottomSheet: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  content: {
    flex: 1
  },
  handle: {
    width: 50,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8
  }
});

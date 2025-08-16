import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export interface TopSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: (string | number)[];
  children: React.ReactNode;
}

export const TopSheet = ({ bottomSheetRef, snapPoints, children }: TopSheetProps) => {
  const invertedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: -1 }]
    };
  });

  return (
    <Animated.View style={[styles.topSheetContainer, invertedContainerStyle]}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        onChange={index => {
          console.log('TopSheet index:', index);
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Animated.View style={[invertedContainerStyle, styles.content]}>
            {children}
          </Animated.View>
        </BottomSheetView>
      </BottomSheet>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topSheetContainer: {
    flex: 1,
    backgroundColor: 'transparent'
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
    height: 10,
    backgroundColor: 'red'
  }
});

import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

interface ScrollableContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  bounces?: boolean;
  alwaysBounceVertical?: boolean;
  nestedScrollEnabled?: boolean;
  removeClippedSubviews?: boolean;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  testID?: string;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  scrollEnabled = true,
  bounces = true,
  alwaysBounceVertical = true,
  nestedScrollEnabled = true,
  removeClippedSubviews = false,
  keyboardShouldPersistTaps = 'handled',
  testID,
  ...props
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      alwaysBounceVertical={alwaysBounceVertical}
      nestedScrollEnabled={nestedScrollEnabled}
      removeClippedSubviews={removeClippedSubviews}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      testID={testID}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

export default ScrollableContainer;

import React from 'react';
import { FlatList, StyleSheet, ViewStyle, RefreshControl } from 'react-native';

interface ScrollableFlatListProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  scrollEnabled?: boolean;
  bounces?: boolean;
  alwaysBounceVertical?: boolean;
  nestedScrollEnabled?: boolean;
  removeClippedSubviews?: boolean;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  refreshControl?: React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
  testID?: string;
}

const ScrollableFlatList = <T extends any>({
  data,
  renderItem,
  keyExtractor,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  scrollEnabled = true,
  bounces = true,
  alwaysBounceVertical = true,
  nestedScrollEnabled = true,
  removeClippedSubviews = false,
  keyboardShouldPersistTaps = 'handled',
  refreshControl,
  onRefresh,
  refreshing = false,
  testID,
  ...props
}: ScrollableFlatListProps<T>) => {
  // RefreshControl personalizado
  const customRefreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#FF6B35']}
      tintColor="#FF6B35"
    />
  ) : refreshControl;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      alwaysBounceVertical={alwaysBounceVertical}
      nestedScrollEnabled={nestedScrollEnabled}
      removeClippedSubviews={removeClippedSubviews}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      refreshControl={customRefreshControl}
      testID={testID}
      {...props}
    />
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

export default ScrollableFlatList;

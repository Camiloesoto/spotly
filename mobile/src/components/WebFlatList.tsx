import React, { forwardRef } from 'react';
import { Platform, FlatList, ViewStyle, RefreshControl } from 'react-native';

interface WebFlatListProps<T> {
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

const WebFlatList = forwardRef<any, WebFlatListProps<any>>(({
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
}, ref) => {
  // En web, usar un div con scroll nativo
  if (Platform.OS === 'web') {
    return (
      <div
        ref={ref}
        style={{
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
        data-testid={testID}
      >
        <div style={{
          minHeight: '100%',
          padding: '16px',
          ...contentContainerStyle as any,
        }}>
          {data.map((item, index) => (
            <div key={keyExtractor(item, index)}>
              {renderItem({ item })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // En móvil, usar FlatList normal
  return (
    <FlatList
      ref={ref}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      scrollEnabled={scrollEnabled}
      bounces={bounces}
      alwaysBounceVertical={alwaysBounceVertical}
      nestedScrollEnabled={nestedScrollEnabled}
      removeClippedSubviews={removeClippedSubviews}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      refreshControl={refreshControl}
      testID={testID}
      {...props}
    />
  );
});

WebFlatList.displayName = 'WebFlatList';

export default WebFlatList;

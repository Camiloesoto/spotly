import React, { forwardRef } from 'react';
import { Platform, ScrollView, ViewStyle } from 'react-native';

interface WebScrollViewProps {
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

const WebScrollView = forwardRef<any, WebScrollViewProps>(({
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
          paddingBottom: '100px',
          ...contentContainerStyle as any,
        }}>
          {children}
        </div>
      </div>
    );
  }

  // En móvil, usar ScrollView normal
  return (
    <ScrollView
      ref={ref}
      style={style}
      contentContainerStyle={contentContainerStyle}
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
});

WebScrollView.displayName = 'WebScrollView';

export default WebScrollView;

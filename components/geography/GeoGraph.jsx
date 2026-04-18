import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default function GeoGraph({ data }) {
  const features = Array.isArray(data) ? data : [];

  if (features.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Graph Analysis</Text>
        <Text style={{ color: Colors.textMuted, marginTop: 8 }}>
          No graph data available.
        </Text>
      </View>
    );
  }

  const vals = features.map(f => (Array.isArray(f.data) ? f.data.length : 1));
  const maxVal = Math.max(...vals, 1); // 0 se bachao

  const BAR_WIDTH = 40;
  const BAR_MAX_HEIGHT = 160;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feature Distribution</Text>
      <Text style={styles.subtitle}>Data points per feature</Text>

      {/* Horizontal scroll so bars never clip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScroll}
      >
        {features.map((item, idx) => {
          const val = vals[idx];
          const barH = Math.max((val / maxVal) * BAR_MAX_HEIGHT, 4); // min 4px visible
          const barColor = item.color || Colors.accent;

          return (
            <View key={idx} style={[styles.barGroup, { width: BAR_WIDTH + 16 }]}>
              {/* Value label */}
              <Text style={styles.valText}>{val}</Text>

              {/* Bar */}
              <View style={[styles.barTrack, { height: BAR_MAX_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barH,
                      width: BAR_WIDTH,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>

              {/* X label */}
              <Text style={styles.xLabel} numberOfLines={2}>
                {item.label || ""}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {features.map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: item.color || Colors.accent },
              ]}
            />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Facts */}
      {features.some(f => f.facts) && (
        <View style={styles.factsContainer}>
          {features.map((item, idx) =>
            item.facts ? (
              <View key={idx} style={styles.factRow}>
                <View
                  style={[
                    styles.factDot,
                    { backgroundColor: item.color || Colors.accent },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.factLabel}>{item.label}</Text>
                  <Text style={styles.factText}>{item.facts}</Text>
                </View>
              </View>
            ) : null
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 16,
  },
  chartScroll: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  barGroup: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  valText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  barTrack: {
    justifyContent: 'flex-end', // bar neeche se grow kare
    alignItems: 'center',
  },
  bar: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  xLabel: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  factsContainer: {
    marginTop: 16,
    gap: 10,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  factDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  factLabel: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  factText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
  },
});
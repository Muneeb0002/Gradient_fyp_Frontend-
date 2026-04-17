import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const hardcodedResponse = {
    "success": true,
    "message": "Analysis completed successfully",
    "data": {
        "features": [
            {
                "type": "region",
                "label": "Wheat",
                "data": [1,2,3],
                "color": "#fbbf24"
            },
            {
                "type": "region",
                "label": "Rice",
                "data": [1,2,3],
                "color": "#86efac"
            },
            {
                "type": "region",
                "label": "Maize",
                "data": [1,2],
                "color": "#fde047"
            },
            {
                "type": "region",
                "label": "Sugarcane",
                "data": [1,2,3],
                "color": "#166534"
            },
            {
                "type": "region",
                "label": "Cotton Hubs",
                "data": [1,2],
                "color": "#f8fafc"
            },
            {
                "type": "region",
                "label": "Pulses",
                "data": [1],
                "color": "#fbbf24"
            },
            {
                "type": "region",
                "label": "Oilseeds",
                "data": [1,2],
                "color": "#facc15"
            }
        ]
    }
};

export default function GeoGraph() {
  const features = hardcodedResponse.data.features;
  const maxVal = Math.max(...features.map(f => f.data.length)) + 1; // max is 4

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Crop Regions in Pakistan</Text>
       <Text style={styles.subtitle}>Number of major production areas</Text>

       <View style={styles.chartArea}>
         <View style={styles.barsContainer}>
           {features.map((item, idx) => {
             const val = item.data.length;
             return (
               <View key={idx} style={styles.barGroup}>
                 <View style={styles.bars}>
                   <View style={styles.barWrapper}>
                     <Text style={styles.valText}>{val}</Text>
                     <View style={[styles.bar, { height: (val / maxVal) * 200, backgroundColor: item.color }]} />
                   </View>
                 </View>
                 <Text style={styles.xLabel} numberOfLines={1}>{item.label.split(' ')[0]}</Text>
               </View>
             );
           })}
         </View>
       </View>
       
       <View style={styles.legendContainer}>
         {features.map((item, idx) => (
           <View key={`leg-${idx}`} style={styles.legendItem}>
             <View style={[styles.legendColor, { backgroundColor: item.color }]} />
             <Text style={styles.legendText}>{item.label}</Text>
           </View>
         ))}
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "transparent",
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
  chartArea: {
    height: 250,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barGroup: {
    alignItems: 'center',
    width: 36,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: "100%",
  },
  bar: {
    width: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  valText: {
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '700',
  },
  xLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    color: Colors.textMuted,
    fontSize: 11,
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBar = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={[styles.circle, currentStep === index + 1 && styles.activeCircle]}>
              <Text style={[styles.circleText, currentStep === index + 1 && styles.activeCircleText]}>{index + 1}</Text>
            </View>
            <Text style={[styles.label, currentStep === index + 1 && styles.activeLabel]}>{step}</Text>
          </View>
          {index !== steps.length - 1 && <View style={styles.line} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginVertical: 20, 
    paddingHorizontal: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  step: {
    alignItems: 'center',
    flex: 1, 
  },
  circle: {
    width: 35, 
    height: 35, 
    borderRadius: 15, 
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeCircle: {
    backgroundColor: '#00bfff',
    width: 35, 
    height: 35, 
    borderRadius: 15, 
    marginBottom: 6,
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeCircleText: {
    color: '#fff',
  },
  label: {
    color: '#7d7a7d',
    fontSize: 14, 
    textAlign: 'center', 
    flexWrap: 'wrap',
    maxWidth: 60, 
  },
  activeLabel: {
    color: 'black',
    fontSize: 12, 
    fontWeight: 'bold',
  },
  line: {
    width: 25, 
    height: 2,
    backgroundColor: '#ccc',
    marginBottom: 25,
  },
});

export default StatusBar;

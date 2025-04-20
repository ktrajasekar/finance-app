import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  GestureResponderEvent, // Import event type if needed, though often inferred
  StyleProp,           // Import Style types
  ViewStyle,
  TextStyle
} from 'react-native';

// Optional: Define an interface for the calculated results (can be useful)
interface CalculationResults {
  futureValue: number;
  totalInvested: number;
  estimatedReturns: number;
}

// Define Props type - in this case, it doesn't receive props, so it's empty
type Props = {};

const MutualFundCalculator: React.FC<Props> = () => {
  // State variables with explicit types
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [annualRate, setAnnualRate] = useState<string>('');
  const [tenureYears, setTenureYears] = useState<string>('');

  // State for results - using individual state or the interface above
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalInvested, setTotalInvested] = useState<number | null>(null);
  const [estimatedReturns, setEstimatedReturns] = useState<number | null>(null);
  // --- OR --- using the interface (choose one approach)
  // const [results, setResults] = useState<CalculationResults | null>(null);

  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const calculateSIP = (): void => { // Explicitly type return as void
    Keyboard.dismiss(); // Hide keyboard on calculation

    // Parse inputs - parseFloat returns number or NaN
    const P: number = parseFloat(monthlyInvestment);
    const rate: number = parseFloat(annualRate);
    const years: number = parseFloat(tenureYears);

    // Input Validation
    if (isNaN(P) || P <= 0 || isNaN(rate) || rate < 0 || isNaN(years) || years <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid positive numbers for all fields.');
      setIsCalculated(false);
      setFutureValue(null);
      setTotalInvested(null);
      setEstimatedReturns(null);
      // --- OR --- if using the interface approach
      // setResults(null);
      return;
    }

    // Explicitly type calculation variables (optional, TS often infers well)
    const i: number = rate / 12 / 100; // Monthly interest rate
    const n: number = years * 12; // Total number of months (periods)

    // Calculate Future Value
    const calculatedFV: number = P * ((Math.pow(1 + i, n) - 1) / i);
    const calculatedTotalInvested: number = P * n;
    const calculatedEstimatedReturns: number = calculatedFV - calculatedTotalInvested;

    // Set state with calculated numbers
    setFutureValue(calculatedFV);
    setTotalInvested(calculatedTotalInvested);
    setEstimatedReturns(calculatedEstimatedReturns);
    // --- OR --- if using the interface approach
    // setResults({
    //   futureValue: calculatedFV,
    //   totalInvested: calculatedTotalInvested,
    //   estimatedReturns: calculatedEstimatedReturns,
    // });
    setIsCalculated(true);
  };

  // Helper to format currency - type the input and return value
  const formatCurrency = (value: number | null): string => {
    // Check for null or NaN explicitly before calling number methods
    if (value === null || isNaN(value)) {
      return '₹ 0.00';
    }
    // Simple formatting, consider using a library for more complex needs
    return `₹ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Optional: Explicitly type the dismiss keyboard handler if needed
  const handleDismissKeyboard = (): void => {
    Keyboard.dismiss();
  }

  return (
    // onPress type is inferred correctly usually, but can be explicit:
    // onPress={(event: GestureResponderEvent) => Keyboard.dismiss()}
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mutual Fund SIP Calculator</Text>

        {/* Inputs Section - TextInput onChangeText provides string */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monthly Investment Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5000"
            keyboardType="numeric"
            value={monthlyInvestment}
            onChangeText={setMonthlyInvestment} // Type (text: string) => void matches useState setter
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected Annual Return Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 12"
            keyboardType="numeric"
            value={annualRate}
            onChangeText={setAnnualRate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Investment Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10"
            keyboardType="numeric"
            value={tenureYears}
            onChangeText={setTenureYears}
          />
        </View>

        {/* Calculate Button - onPress type is () => void */}
        <View style={styles.buttonContainer}>
          <Button title="Calculate Future Value" onPress={calculateSIP} color="#007bff" />
        </View>

        {/* Results Section - Conditionally rendering based on state */}
        {/* Use results.futureValue etc. if using the interface approach */}
        {isCalculated && futureValue !== null && totalInvested !== null && estimatedReturns !== null && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Calculation Results:</Text>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Total Amount Invested:</Text>
              <Text style={styles.resultValue}>{formatCurrency(totalInvested)}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Estimated Returns:</Text>
              <Text style={styles.resultValue}>{formatCurrency(estimatedReturns)}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Total Future Value:</Text>
              <Text style={[styles.resultValue, styles.totalValue]}>{formatCurrency(futureValue)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

// Styles - Define types for StyleSheet objects
interface Style {
  container: ViewStyle;
  title: TextStyle;
  inputGroup: ViewStyle;
  label: TextStyle;
  input: ViewStyle | TextStyle; // TextInput styles can overlap View/Text
  buttonContainer: ViewStyle;
  resultsContainer: ViewStyle;
  resultsTitle: TextStyle;
  resultItem: ViewStyle;
  resultLabel: TextStyle;
  resultValue: TextStyle;
  totalValue: TextStyle;
}

// StyleSheet.create infers types well, but explicit Style definition is good practice
const styles = StyleSheet.create<Style>({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#343a40',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#495057',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 15,
    marginBottom: 30,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600', // Use string for fontWeight
    marginBottom: 15,
    textAlign: 'center',
    color: '#212529',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  resultLabel: {
    fontSize: 16,
    color: '#495057',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500', // Use string for fontWeight
    color: '#212529',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default MutualFundCalculator;
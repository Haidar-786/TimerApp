import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CompletedTimer = {
  id: string;
  name: string;
  completionTime: string;
};

const HistoryScreen: React.FC = () => {
  const [completedTimers, setCompletedTimers] = useState<CompletedTimer[]>([]);

  const fetchCompletedTimers = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('timers');
      if (savedHistory) {
        // Parse the saved data and filter out only the completed timers
        const timers = JSON.parse(savedHistory);
        const completed = timers.filter((timer: any) => timer.status.includes('Completed'));
        setCompletedTimers(completed);
      }
    } catch (error) {
      console.error('Error fetching completed timers:', error);
    }
  };

  useEffect(() => {
    // Fetch completed timers when the screen loads
    fetchCompletedTimers();
  }, []);


  return (
    <>
      <Text style={styles.title}>Completed Timer History</Text>
      <View style={styles.container}>
        {completedTimers.length > 0 ? (
          <FlatList
            data={completedTimers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.timerCategory}>{item.category}</Text>
                <Text style={styles.timerName}>{item.name}</Text>
                <Text style={styles.completedAt}>Completed at: {item.completedAt}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noHistory}>No completed timers yet.</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  timerName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  completedAt: {
    fontSize: 14,
    color: '#888',
  },
  noHistory: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default HistoryScreen;
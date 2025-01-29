import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Alert,
    Button,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTimerModal from '../components/AddTimerModal';
import * as Progress from 'react-native-progress';
import { CustomAlert } from '../components/CustomAlert';

type Timer = {
    id: string;
    name: string;
    duration: number;
    category: string;
    remainingTime: number;
    status: 'Running' | 'Paused' | 'Completed';
    halfwayAlert?: boolean;
    completedAt: string
};

type GroupedTimers = {
    title: string;
    data: Timer[];
};
interface AlertState {
    visible: boolean;
    title: string;
    message: string;
}


export const TimersScreen = () => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [alert, setAlert] = useState<AlertState>({
        visible: false,
        title: '',
        message: '',
    });

    const saveTimersToStorage = async (updatedTimers: Timer[]) => {
        try {
            await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
        } catch (error) {
            console.error('Error saving timers:', error);
        }
    };

    const fetchTimersFromStorage = async () => {
        try {
            const savedTimers = await AsyncStorage.getItem('timers');
            if (savedTimers) {

                setTimers(JSON.parse(savedTimers));
            }
        } catch (error) {
            console.error('Error fetching timers:', error);
        }
    };

    const handleAddTimer = (timer: Timer) => {
        const updatedTimers = [...timers, timer];
        setTimers(updatedTimers);
        saveTimersToStorage(updatedTimers);
    };

    const startTimer = (id: string) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer: any) => {
                if (timer.id === id && timer.status !== 'Completed') {
                    intervalRefs.current[id] = setInterval(() => {
                        setTimers((currentTimers) =>
                            currentTimers.map((t: any) => {
                                if (t.id === id) {
                                    if (t.remainingTime > 0) {
                                        //Check for halfway alert
                                        if (!t.halfwayAlert && t.remainingTime === Math.floor(t.duration / 2)) {
                                            showAlertAndDismiss('Timer', `${t.name} has reached 50%!`)
                                        }

                                        return { ...t, remainingTime: t.remainingTime - 1 };
                                    } else {
                                        clearInterval(intervalRefs.current[id]);
                                        delete intervalRefs.current[id];
                                        Alert.alert('Timer Completed', `${t.name} has finished!`);
                                        const updatedTimer = { ...t, status: 'Completed', completedAt: new Date().toLocaleString() };
                                        saveTimersToStorage(currentTimers.map(t => t.id === id ? updatedTimer : t));
                                        return updatedTimer;
                                    }
                                }
                                return t;
                            })
                        );
                    }, 1000);
                    const updatedTimer = { ...timer, status: 'Running' };
                    saveTimersToStorage(prevTimers.map(t => t.id === id ? updatedTimer : t));
                    return updatedTimer;
                }
                return timer;
            })
        );
    };

    const pauseTimer = (id: string) => {
        clearInterval(intervalRefs.current[id]);
        delete intervalRefs.current[id];
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                if (timer.id === id) {
                    const updatedTimer = { ...timer, status: 'Paused' };
                    saveTimersToStorage(prevTimers.map(t => t.id === id ? updatedTimer : t));
                    return updatedTimer;
                }
                return timer;
            })
        );
    };

    const resetTimer = (id: string) => {
        clearInterval(intervalRefs.current[id]);
        delete intervalRefs.current[id];
        setTimers((prevTimers) =>
            prevTimers.map((timer?: any) => {
                if (timer.id === id) {
                    const updatedTimer = { ...timer, remainingTime: timer.duration, status: 'Paused' };
                    saveTimersToStorage(prevTimers.map(t => t.id === id ? updatedTimer : t));
                    return updatedTimer;
                }
                return timer;
            })
        );
    };

    const toggleSection = (category: string) => {
        setExpandedSections((prev) => {
            const updated = new Set(prev);
            if (updated.has(category)) {
                updated.delete(category);
            } else {
                updated.add(category);
            }
            return updated;
        });
    };

    const groupTimersByCategory = (): GroupedTimers[] => {
        const grouped = timers.reduce((acc: { [key: string]: Timer[] }, timer) => {
            if (!acc[timer.category]) {
                acc[timer.category] = [];
            }
            acc[timer.category].push(timer);
            return acc;
        }, {});

        return Object.keys(grouped).map((category) => ({
            title: category,
            data: grouped[category],
        }));
    };

    useEffect(() => {
        fetchTimersFromStorage();
        // return () => {
        //     Object.values(intervalRefs.current).forEach(clearInterval);
        // };
    }, []);

    const updateAllTimers = (status: 'Paused' | 'Running' | 'Completed', category?: string) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) => {
                // If category is provided, only update timers for that category
                if (category && timer.category !== category) {
                    return timer;
                }

                const updatedTimer = { ...timer, status };

                // Handle "Running" status logic for startAll
                if (status === 'Running' && timer.status !== 'Completed') {
                    // Start the interval if it's not already running
                    if (!intervalRefs.current[timer.id]) {
                        intervalRefs.current[timer.id] = setInterval(() => {
                            setTimers((currentTimers?: any) =>
                                currentTimers.map((t?: any) => {
                                    if (t.id === timer.id) {
                                        if (t.remainingTime > 0) {
                                            if (t.halfwayAlert && t.remainingTime === Math.floor(t.duration / 2)) {
                                                showAlertAndDismiss('Timer', `${t.name} has reached 50%!`);
                                            }

                                            return { ...t, remainingTime: t.remainingTime - 1 };
                                        } else {
                                            clearInterval(intervalRefs.current[timer.id]);
                                            delete intervalRefs.current[timer.id];
                                            Alert.alert('Timer Completed', `${t.name} has finished!`);
                                            const updatedTimer = { ...t, status: 'Completed', completedAt: new Date().toLocaleString() };
                                            saveTimersToStorage(currentTimers.map((t: any) => t.id === timer.id ? updatedTimer : t));
                                            return updatedTimer;
                                        }
                                    }
                                    return t;
                                })
                            );
                        }, 1000);
                    }
                }

                // Handle "Paused" status logic for pauseAll
                if (status === 'Paused' && intervalRefs.current[timer.id]) {
                    // Clear the interval when the status is Paused
                    clearInterval(intervalRefs.current[timer.id]);
                    delete intervalRefs.current[timer.id];
                }

                // Return the updated timer
                return updatedTimer;
            })
        );
    };


    const handlePauseAll = (category?: string) => {
        updateAllTimers('Paused', category);
    };

    const handleResetAll = (category?: string) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer: any) => {
                // If category is provided, only reset timers for that category
                if (category && timer.category !== category) {
                    return timer;
                }

                const updatedTimer = { ...timer, remainingTime: timer.duration, status: 'Paused' };
                saveTimersToStorage(prevTimers.map(t => t.id === timer.id ? updatedTimer : t));
                return updatedTimer;
            })
        );
    };

    const handlestartAll = (category?: string) => {
        updateAllTimers('Running', category);
    };

    const groupedTimers = groupTimersByCategory();

    // Function to show and dismiss the alert
    const showAlertAndDismiss = (title: string, message: string) => {
        setAlert({
            visible: true,
            title: title,
            message: message,
        });

        // Dismiss the alert after 1 second (1000ms)
        setTimeout(() => {
            setAlert(prev => ({
                ...prev,
                visible: false,
            }));
        }, 1000);
    };


    return (
        <View style={styles.container}>
            <CustomAlert visible={alert.visible} title={alert.title} message={alert.message} />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <SectionList
                sections={groupedTimers}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    expandedSections.has(item.category) && (
                        <View style={styles.timerItem}>
                            <Text style={styles.timerName}>{item.name}</Text>
                            <Progress.Bar
                                progress={item.status === 'Completed' ? 100 : item.remainingTime / item.duration}
                                width={200}
                                color={item.status === 'Completed' ? 'green' : 'blue'}
                            />
                            <Text>Remaining Time: {item.remainingTime}s</Text>
                            <Text>Status: {item.status}</Text>
                            <View style={styles.timerControls}>
                                <Button
                                    title={'Start'}
                                    onPress={() => startTimer(item.id)}
                                />
                                <Button title="Reset" onPress={() => resetTimer(item.id)} />
                                <Button title="Pause" onPress={() => pauseTimer(item.id)} />
                            </View>
                        </View>
                    )
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.categoryHeader}>
                        <TouchableOpacity
                            style={styles.ButtonHeaders}
                            onPress={() => toggleSection(title)}
                        >
                            <Text style={styles.categoryTitle}>{title}</Text>
                            <Ionicons
                                name={expandedSections.has(title) ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                        <View style={styles.timerControls}>
                            <Button
                                title={'PauseALL'}
                                onPress={() => handlePauseAll(title)} />
                            <Button title="ResetALL" onPress={() => handleResetAll(title)} />
                            <Button title="startAll" onPress={() => handlestartAll(title)} />
                        </View>
                    </View>
                )}

            />

            {modalVisible && (
                <AddTimerModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleAddTimer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'blue',
        borderRadius: 50,
        padding: 15,
        zIndex: 1,
    },
    categoryHeader: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    ButtonHeaders: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timerItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    timerName: {
        fontWeight: 'bold',
    },
    timerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
});

export default TimersScreen;

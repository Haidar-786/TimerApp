import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
} from 'react-native';

type AddTimerModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void
};

type Timer = {
    id: string;
    name: string;
    duration: number;
    category: string;
    remainingTime: number;
    status: 'Running' | 'Paused' | 'Completed';
    halfwayAlert?: boolean;  // Optional halfway alert flag
    completedAt: string | null
};


const AddTimerModal: React.FC<AddTimerModalProps> = ({ visible, onClose, onSave }) => {
    const [name, setName] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const handleSave = () => {
        if (!name || !duration || !category) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const newTimer: Timer = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration, 10),
            category,
            remainingTime: parseInt(duration, 10),
            status: 'Paused',
            halfwayAlert: true, // Set halfway alert to true
            completedAt: null,
        };

        onSave(newTimer);
        onClose();
        setName('');
        setDuration('');
        setCategory('');
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Timer</Text>

                    <TextInput
                        placeholder="Name"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        placeholder="Duration (seconds)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={duration}
                        onChangeText={setDuration}
                    />
                    <TextInput
                        placeholder="Category"
                        style={styles.input}
                        value={category}
                        onChangeText={setCategory}
                    />

                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={onClose} color="red" />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default AddTimerModal;

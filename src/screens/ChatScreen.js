import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Colors from '../constants/Colors';

const chatsData = [
    {
        id: '1',
        name: 'דני לוי',
        lastMessage: 'היי, מה קורה?',
        time: '10:30',
    },
    {
        id: '2',
        name: 'נועה כהן',
        lastMessage: 'הספר עדיין זמין?',
        time: '09:15',
    },
    {
        id: '3',
        name: 'יוסי ישראלי',
        lastMessage: 'תודה רבה!',
        time: 'אתמול',
    },
];

export default function ChatScreen() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: '1', text: 'שלום!', sender: 'them' },
        { id: '2', text: 'היי, מה שלומך?', sender: 'me' },
    ]);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (flatListRef.current && selectedChat) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, selectedChat]);

    const handleSend = () => {
        if (message.trim() === '') return;
        setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'me' }]);
        setMessage('');
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => setSelectedChat(item)}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    );

    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>צ'אטים</Text>
            </View>
            {!selectedChat ? (
                <FlatList
                    data={chatsData}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.chatItem} onPress={() => setSelectedChat(item)}>
                            {/* Avatar on the left */}
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{item.name[0]}</Text>
                            </View>
                            {/* Info aligned to the right */}
                            <View style={[styles.chatInfo, { alignItems: 'flex-end' }]}>
                                <Text style={[styles.chatName, { textAlign: 'right' }]}>{item.name}</Text>
                                <Text style={[styles.lastMessage, { textAlign: 'right' }]}>{item.lastMessage}</Text>
                            </View>
                            <Text style={[styles.time, { textAlign: 'right' }]}>{item.time}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.chatsList}
                />
            ) : (
                <KeyboardAvoidingView
                    style={styles.chatContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={90}
                >
                    <View style={styles.chatHeader}>
                        <TouchableOpacity onPress={() => setSelectedChat(null)}>
                            <Text style={styles.backButton}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.chatTitle}>{selectedChat.name}</Text>
                    </View>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={renderMessageItem}
                        contentContainerStyle={styles.messagesList}
                        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="הקלד הודעה..."
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Text style={styles.sendButtonText}>שלח</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: Colors.primary,
        paddingTop: 16,
        paddingBottom: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    chatsList: {
        padding: 8,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
    },
    lastMessage: {
        color: '#888',
        fontSize: 15,
        marginTop: 2,
    },
    time: {
        color: '#aaa',
        fontSize: 13,
        marginLeft: 8,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        color: '#fff',
        fontSize: 22,
        marginRight: 16,
    },
    chatTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    messagesList: {
        padding: 10,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 18,
        marginVertical: 4,
    },
    myMessage: {
        backgroundColor: Colors.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        backgroundColor: '#e5e5ea',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#222',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 8,
        color: '#222',
    },
    sendButton: {
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import { useUser } from '../../contexts/UserContext'; 
import styles from './styles';

function Conversation({ route }) {
  const { conversationId, userId } = route.params; 
  const [messages, setMessages] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const { user } = useUser(); 
  const BASE_URL = useBaseUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMessages = await fetch(`${BASE_URL}/messages`);
        const messagesData = await responseMessages.json();

        const conversationMessages = messagesData.filter((message) => message.conversationId === conversationId);
        setMessages(conversationMessages);

        const responseUsers = await fetch(`${BASE_URL}/users`);
        const usersData = await responseUsers.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [BASE_URL, conversationId]);

  const getUserLogin = (userId) => {
    const foundUser = users.find((user) => user.id === userId);
    return foundUser ? foundUser.login : 'Nieznany użytkownik';
  };

  const renderMessageItem = ({ item }) => {
    const senderLogin = getUserLogin(item.senderId);

    return (
      <View style={styles.messageItem}>
        <Text style={styles.messageSender}>{senderLogin}:</Text>
        <Text style={styles.messageContent}>{item.content}</Text>
        <Text style={styles.messageTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    );
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const message = {
      conversationId,
      senderId: user.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
  
    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message), 
      });

      if (response.ok) {
        const updatedMessage = await response.json(); 
        setMessages((prevMessages) => [...prevMessages, updatedMessage]);
        setNewMessage(''); 
      } else {
        console.error('Błąd wysyłania wiadomości');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
    }
  };

  return (
    <View style={styles.container}>
      {messages.length > 0 ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
          />
          <View style={styles.inputContainer}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.input}
              placeholder="Napisz wiadomość..."
            />
            <TouchableOpacity style={styles.button} onPress={sendMessage}>
              <Text style={styles.buttonText}>Wyślij</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Brak wiadomości w tej rozmowie</Text>
      )}
    </View>
  );
}

export default Conversation;

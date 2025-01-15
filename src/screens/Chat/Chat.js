import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useBaseUrl } from '../../contexts/BaseUrlContext';
import { useUser } from '../../contexts/UserContext'; 
import styles from './styles';

function Chat({ navigation }) {
  const [conversations, setConversations] = useState([]); 
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  const BASE_URL = useBaseUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMessages = await fetch(`${BASE_URL}/messages`);
        const messagesData = await responseMessages.json();
        
        const groupedConversations = messagesData.reduce((acc, message) => {
          if (!acc[message.conversationId]) {
            acc[message.conversationId] = {
              conversationId: message.conversationId,
              participants: new Set([message.senderId]), 
              lastMessage: message.content,
            };
          } else {
            acc[message.conversationId].participants.add(message.senderId);
            acc[message.conversationId].lastMessage = message.content;
          }
          return acc;
        }, {});

        const conversationList = Object.values(groupedConversations);
        setConversations(conversationList);

        const responseUsers = await fetch(`${BASE_URL}/users`);
        const usersData = await responseUsers.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [BASE_URL]);

  const getUserLogin = (userId) => {
    const foundUser = users.find((user) => user.id === userId);
    return foundUser ? foundUser.login : 'Nieznany użytkownik';
  };

  const goToConversation = (conversationId, participants) => {
    const otherUserId = [...participants].find((id) => id !== user.id);
    navigation.navigate('Conversation', { conversationId, userId: otherUserId });
  };

  const getOtherUserLogin = (participants) => {
    const otherParticipants = [...participants].filter((participantId) => participantId !== user.id);
    return otherParticipants.map(getUserLogin).join(', ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twoje rozmowy</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item }) => {
          const otherUserLogin = getOtherUserLogin(item.participants);

          return (
            <TouchableOpacity onPress={() => goToConversation(item.conversationId, item.participants)}>
              <View style={styles.conversationItem}>
                <Text style={styles.conversationText}>
                  Rozmowa z: {otherUserLogin}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default Chat;

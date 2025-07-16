// // A-Z Health Advisor App - Enhanced & Corrected Version
// // FIX: Removed invalid 'HARM_CATEGORY_MEDICAL' from safety settings.
// // ADDED: API Key check on startup.
// // By A-Z Technology

// import { Feather } from '@expo/vector-icons'; // For icons
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// // --- CONFIGURATION ---
// // ⚠️ PASTE YOUR GEMINI API KEY HERE. If you don't, the app will warn you.
// const GEMINI_API_KEY = 'AIzaSyDzni-ZY3d7QbJc17OhER6HWDtBTyhy8g8'; 
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
// const { width, height } = Dimensions.get('window');

// // --- AI HELPER FUNCTION (Corrected Safety Settings) ---
// const callGeminiAPI = async (prompt) => {
//     // This is the corrected list of safety settings supported by the Gemini API.
//     const validSafetySettings = [
//         { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//         { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//         { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//         { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//     ];

//     const body = JSON.stringify({r
//         contents: [{
//             role: 'user',
//             parts: [{ text: prompt }]
//         }],
//         generationConfig: {
//             temperature: 0.7,
//             maxOutputTokens: 2048,
//         },
//         safetySettings: validSafetySettings,
//     });

//     try {
//         const response = await fetch(GEMINI_API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body,
//         });
//         const data = await response.json();
        
//         if (response.ok && data.candidates && data.candidates.length > 0) {
//             return data.candidates[0].content.parts[0].text;
//         } else {
//             const errorMsg = data.error?.message || 'The AI is unavailable. Please check the API key and try again.';
//             throw new Error(errorMsg);
//         }
//     } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw new Error('Network error or invalid API key. Please check your connection and configuration.');
//     }
// };

// // --- SUB-COMPONENTS ---

// const LoginScreen = ({ onLogin }) => {
//     const [name, setName] = useState('');
    
//     // Check for API key when the component mounts
//     useEffect(() => {
//         if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || GEMINI_API_KEY === '') {
//             Alert.alert(
//                 'Configuration Needed',
//                 'Please add your Gemini API key to the App.js file to enable AI features.',
//                 [{ text: 'OK' }]
//             );
//         }
//     }, []);

//     const handleLogin = () => {
//         if (name.trim().length > 2) {
//             onLogin(name.trim());
//         } else {
//             Alert.alert('Invalid Name', 'Please enter a name with at least 3 characters.');
//         }
//     };

//     return (
//         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.loginContainer}>
//             <View style={styles.loginContent}>
//                 <Image 
//                     source={{ uri: 'https://i.ibb.co/6PqjXfJ/health-logo.png' }} // A generic logo placeholder
//                     style={styles.logo}
//                 />
//                 <Text style={styles.loginTitle}>AI Health Advisor</Text>
//                 <Text style={styles.loginSubtitle}>Your personal wellness companion</Text>
//                 <TextInput
//                     style={styles.loginInput}
//                     placeholder="Enter your first name"
//                     placeholderTextColor="#999"
//                     value={name}
//                     onChangeText={setName}
//                 />
//                 <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                     <Text style={styles.loginButtonText}>Get Started</Text>
//                     <Feather name="arrow-right-circle" size={22} color="white" />
//                 </TouchableOpacity>
//             </View>
//         </KeyboardAvoidingView>
//     );
// };

// const ChatScreen = ({ username }) => {
//     const [messages, setMessages] = useState([
//         { id: 'initial-bot-message', role: 'model', content: `Hi ${username}! I'm your AI Health Advisor. How are you feeling?\n\nRemember, I am an AI, not a doctor.` }
//     ]);
//     const [inputMessage, setInputMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const scrollViewRef = useRef();

//     const handleSendMessage = async () => {
//         if (inputMessage.trim() === '' || isLoading) return;

//         const userMessage = { id: Date.now().toString(), role: 'user', content: inputMessage.trim() };
//         const newMessages = [...messages, userMessage];
//         setMessages(newMessages);
//         setInputMessage('');
//         setIsLoading(true);

//         const history = newMessages
//             .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
//             .join('\n');

//         const prompt = `**Your Role:** You are a helpful and cautious AI Health Advisor.
// **CRUCIAL RULE:** ALWAYS start your response with a disclaimer: "**Disclaimer: I am an AI assistant, not a medical professional. This is for informational purposes only. Please consult a qualified healthcare provider for any medical advice.**"
// **Your Task:** Based on the conversation history below, respond to the user's latest message empathetically. Suggest *possible* conditions and common over-the-counter remedies, but NEVER give a definitive diagnosis. Use phrases like "It could be..." or "Common causes include...".

// **Conversation History:**
// ${history}

// **Your Response:**`;
        
//         try {
//             const aiContent = await callGeminiAPI(prompt);
//             const aiMessage = { id: Date.now().toString() + 'ai', role: 'model', content: aiContent };
//             setMessages(prev => [...prev, aiMessage]);
//         } catch (error) {
//             const errorMessage = { id: Date.now().toString() + 'err', role: 'model', content: `Error: ${error.message}` };
//             setMessages(prev => [...prev, errorMessage]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <View style={styles.flexOne}>
//             <ScrollView
//                 ref={scrollViewRef}
//                 style={styles.chatContainer}
//                 contentContainerStyle={styles.chatContentContainer}
//                 onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
//                 {messages.map((msg) => (
//                     <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
//                         <Text style={msg.role === 'user' ? styles.userMessageText : styles.botMessageText}>{msg.content}</Text>
//                     </View>
//                 ))}
//                 {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#4A90E2" />}
//             </ScrollView>
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.textInput}
//                     value={inputMessage}
//                     onChangeText={setInputMessage}
//                     placeholder="Describe your symptoms..."
//                     placeholderTextColor="#999"
//                     multiline
//                     editable={!isLoading}
//                 />
//                 <TouchableOpacity style={[styles.sendButton, isLoading && styles.disabledButton]} onPress={handleSendMessage} disabled={isLoading}>
//                     <Feather name="send" size={24} color="white" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const HealthTipsScreen = () => {
//     const [tip, setTip] = useState('Tap the button below to get a daily wellness tip!');
//     const [isTipLoading, setIsTipLoading] = useState(false);

//     const fetchHealthTip = async () => {
//         setIsTipLoading(true);
//         setTip('');
//         const prompt = `Provide a unique, interesting, and actionable wellness tip for today. Make it encouraging and easy to understand. Start with a catchy title like "Today's Wellness Tip:".`;
//         try {
//             const newTip = await callGeminiAPI(prompt);
//             setTip(newTip);
//         } catch (error) {
//             setTip(`Sorry, couldn't fetch a tip right now. ${error.message}`);
//         } finally {
//             setIsTipLoading(false);
//         }
//     };
    
//     return (
//         <View style={styles.tipsContainer}>
//             <Text style={styles.tipsHeader}>Daily Wellness Boost</Text>
//             <View style={styles.tipCard}>
//                 {isTipLoading ? (
//                     <ActivityIndicator size="large" color="#fff" />
//                 ) : (
//                     <Text style={styles.tipText}>{tip}</Text>
//                 )}
//             </View>
//             <TouchableOpacity style={[styles.tipButton, isTipLoading && styles.disabledButton]} onPress={fetchHealthTip} disabled={isTipLoading}>
//                 <Text style={styles.tipButtonText}>Get New Tip</Text>
//                 <Feather name="refresh-cw" size={20} color="white" />
//             </TouchableOpacity>
//         </View>
//     );
// };

// // --- MAIN APP COMPONENT ---
// export default function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [username, setUsername] = useState('');
//     const [activeTab, setActiveTab] = useState('chat');

//     const handleLogin = (name) => {
//         setUsername(name);
//         setIsLoggedIn(true);
//     };

//     const handleLogout = () => {
//         Alert.alert("Log Out", "Are you sure you want to log out?", [
//             { text: "Cancel", style: "cancel" },
//             { text: "Log Out", onPress: () => {
//                 setUsername('');
//                 setIsLoggedIn(false);
//                 setActiveTab('chat');
//             }}
//         ]);
//     };

//     if (!isLoggedIn) {
//         return (
//             <SafeAreaView style={styles.safeArea}>
//                 <LoginScreen onLogin={handleLogin} />
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexOne}>
//                 <View style={styles.mainHeader}>
//                     <Text style={styles.headerWelcome}>Hi, {username}!</Text>
//                     <TouchableOpacity onPress={handleLogout}>
//                         <Feather name="log-out" size={24} color="#333" />
//                     </TouchableOpacity>
//                 </View>
                
//                 <View style={styles.tabContainer}>
//                     <TouchableOpacity 
//                         style={[styles.tabButton, activeTab === 'chat' && styles.activeTab]} 
//                         onPress={() => setActiveTab('chat')}>
//                         <Feather name="message-circle" size={20} color={activeTab === 'chat' ? '#FFF' : '#4A90E2'} />
//                         <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Advisor Chat</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={[styles.tabButton, activeTab === 'tips' && styles.activeTab]} 
//                         onPress={() => setActiveTab('tips')}>
//                         <Feather name="heart" size={20} color={activeTab === 'tips' ? '#FFF' : '#4A90E2'} />
//                         <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>Health Tips</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {activeTab === 'chat' ? <ChatScreen username={username} /> : <HealthTipsScreen />}
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// }

// // --- STYLESHEET ---
// const styles = StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: '#F4F7FC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
//     flexOne: { flex: 1 },
//     // Login Screen
//     loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7FC', padding: 20 },
//     loginContent: { width: '100%', alignItems: 'center' },
//     logo: { width: 120, height: 120, marginBottom: 20 },
//     loginTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 5 },
//     loginSubtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
//     loginInput: { width: '90%', height: 50, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#DDD' },
//     loginButton: { flexDirection: 'row', backgroundColor: '#4A90E2', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 },
//     loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
//     // Main App Header & Tabs
//     mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
//     headerWelcome: { fontSize: 20, fontWeight: '600', color: '#333' },
//     tabContainer: { flexDirection: 'row', padding: 10, justifyContent: 'space-around', backgroundColor: '#FFF' },
//     tabButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#E8F0F9' },
//     activeTab: { backgroundColor: '#4A90E2' },
//     tabText: { marginLeft: 8, fontSize: 16, color: '#4A90E2', fontWeight: '500' },
//     activeTabText: { color: '#FFF' },
//     // Chat Screen
//     chatContainer: { flex: 1, backgroundColor: '#F4F7FC' },
//     chatContentContainer: { padding: 10 },
//     messageBubble: { maxWidth: '85%', padding: 12, borderRadius: 18, marginBottom: 10 },
//     userMessage: { backgroundColor: '#4A90E2', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
//     botMessage: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#EAEAEA' },
//     userMessageText: { color: 'white', fontSize: 16, lineHeight: 22 },
//     botMessageText: { color: '#333', fontSize: 16, lineHeight: 22 },
//     loadingIndicator: { marginVertical: 20 },
//     inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#EAEAEA', backgroundColor: '#FFF' },
//     textInput: { flex: 1, minHeight: 45, maxHeight: 120, backgroundColor: '#F4F7FC', borderRadius: 22, paddingHorizontal: 20, paddingTop: 12, fontSize: 16, marginRight: 10 },
//     sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center' },
//     disabledButton: { backgroundColor: '#B0C4DE' },
//     // Health Tips Screen
//     tipsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#F4F7FC' },
//     tipsHeader: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
//     tipCard: { width: '100%', minHeight: height * 0.3, backgroundColor: 'rgba(74, 144, 226, 0.9)', borderRadius: 20, padding: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
//     tipText: { fontSize: 18, color: 'white', fontWeight: '500', textAlign: 'center', lineHeight: 28 },
//     tipButton: { flexDirection: 'row', backgroundColor: '#27AE60', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 },
//     tipButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
// });





















// A-Z Health Advisor App - v6.0 "Vision"
// This is a comprehensive, single-file version for a STANDARD Expo project.
// ADDED: Microphone for voice-to-text input.
// ADDED: Text-to-speech for AI voice responses.
// ADDED: Bilingual support (English/Hindi) for voice and text.
// ADDED: Camera & Image Picker for visual questions (multimodal AI).
// ADDED: Enhanced prompt for safer medication suggestions.
// By A-Z Technology

import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView, Platform, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet, Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';

// --- NEW IMPORTS FOR ADVANCED FEATURES ---
import Voice from '@react-native-voice/voice';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

// --- CONFIGURATION ---
const GEMINI_API_KEY = 'AIzaSyD6ziTX2_I0JRpu7CNkGqtc1_mAYcZKJOg'; // Your provided key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
const { width, height } = Dimensions.get('window');


// --- ENHANCED AI HELPER (Now supports images) ---
const callGeminiAPI = async (prompt, base64Image = null) => {
    const validSafetySettings = [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ];

    let parts = [{ text: prompt }];

    // If an image is provided, add it to the request payload
    if (base64Image) {
        parts.push({
            inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image
            }
        });
    }

    const body = JSON.stringify({
        contents: [{ role: 'user', parts: parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048, },
        safetySettings: validSafetySettings,
    });

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        const data = await response.json();
        if (response.ok && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            const errorMsg = data.error?.message || 'The AI is unavailable. Please check the API key and try again.';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw new Error('Network error or invalid API key. Please check your connection and configuration.');
    }
};

// --- SUB-COMPONENTS (Styling Applied) ---

const LoginScreen = ({ onLogin }) => {
    // This component remains the same as your working version, just with updated styles.
    const [name, setName] = useState('');
    const handleLogin = () => {
        if (name.trim().length > 2) onLogin(name.trim());
        else Alert.alert('Invalid Name', 'Please enter a name with at least 3 characters.');
    };
    return (
        <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.flexOne}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.loginContainer}>
                <View style={styles.loginForm}>
                    <Image source={{ uri: 'https://i.ibb.co/6PqjXfJ/health-logo.png' }} style={styles.logo} />
                    <Text style={styles.loginTitle}>AI Health Advisor</Text>
                    <Text style={styles.loginSubtitle}>Your Personal Wellness Companion</Text>
                    <TextInput style={styles.loginInput} placeholder="Enter your first name" placeholderTextColor="#666" value={name} onChangeText={setName} />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                         <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.loginButtonGradient}>
                            <Text style={styles.loginButtonText}>Get Started</Text>
                            <Feather name="arrow-right-circle" size={22} color="white" />
                         </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const ChatScreen = ({ username }) => {
    // --- STATE FOR NEW FEATURES ---
    const [messages, setMessages] = useState([{ id: 'initial-bot-message', role: 'model', content: `Hi ${username}! I'm your AI Health Advisor. You can type, use the microphone, or send a picture.` }]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pickedImage, setPickedImage] = useState(null); // For camera/gallery image
    const [isRecording, setIsRecording] = useState(false); // For microphone state
    const [language, setLanguage] = useState('en-US'); // 'en-US' or 'hi-IN'
    const [isVoiceOutput, setIsVoiceOutput] = useState(false); // For toggling TTS
    const scrollViewRef = useRef();

    // --- PERMISSIONS & VOICE SETUP ---
    useEffect(() => {
        // Request permissions on mount
        (async () => {
            await Camera.requestCameraPermissionsAsync();
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (Platform.OS === 'android') {
                 await Voice.requestPermissions();
            }
        })();

        // Setup Voice event listeners
        const onSpeechResults = (e) => {
            setInputMessage(e.value[0]);
            setIsRecording(false);
        };
        const onSpeechError = (e) => {
            console.error(e);
            setIsRecording(false);
        };
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        return () => { // Cleanup
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // --- HANDLERS FOR NEW FEATURES ---
    const handleLanguageToggle = () => setLanguage(prev => (prev === 'en-US' ? 'hi-IN' : 'en-US'));
    const handleVoiceOutputToggle = () => setIsVoiceOutput(prev => !prev);
    
    const startRecording = async () => {
        setIsRecording(true);
        setInputMessage('');
        try {
            await Voice.start(language);
        } catch (e) {
            console.error(e);
            setIsRecording(false);
        }
    };
    const stopRecording = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
        setIsRecording(false);
    };

    const handlePickImage = async () => {
        Alert.alert("Select Image", "Choose an image source", [
            { text: "Camera", onPress: async () => {
                let result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true });
                if (!result.canceled) setPickedImage(result.assets[0]);
            }},
            { text: "Gallery", onPress: async () => {
                let result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: true });
                if (!result.canceled) setPickedImage(result.assets[0]);
            }},
            { text: "Cancel", style: "cancel" }
        ]);
    };
    
    const speakResponse = (text) => {
      if (isVoiceOutput) {
        Speech.speak(text, { language: language === 'en-US' ? 'en' : 'hi' });
      }
    };

    const handleSendMessage = async () => {
        if ((inputMessage.trim() === '' && !pickedImage) || isLoading) return;

        const userMessageContent = inputMessage.trim();
        const userMessage = { id: Date.now().toString(), role: 'user', content: userMessageContent, imageUri: pickedImage?.uri };
        setMessages(prev => [...prev, userMessage]);
        
        const imageToSend = pickedImage?.base64 || null;

        setInputMessage('');
        setPickedImage(null);
        setIsLoading(true);

        const currentLanguage = language === 'en-US' ? 'English' : 'Hindi';
        const prompt = `**Your Role:** You are a helpful and cautious AI Health Advisor.
**Language for Response:** You MUST respond in ${currentLanguage}.
**CRUCIAL RULE 1:** ALWAYS start your response with a disclaimer: "**Disclaimer: I am an AI assistant, not a medical professional. This is for informational purposes only. Please consult a qualified healthcare provider for any medical advice.**" (Translate this disclaimer to ${currentLanguage} if needed).
**CRUCIAL RULE 2:** If the user asks for a specific medication or tablet, you may suggest a common over-the-counter example (e.g., 'for a headache, something like Paracetamol is common'), but you MUST immediately and strongly follow up with a disclaimer like 'However, this is not a prescription. You MUST consult a qualified doctor before taking any medication.' Do not suggest prescription drugs.
**Your Task:** Analyze the user's text and, if provided, the image. The user's query is: "${userMessageContent}". Respond empathetically and safely according to the rules.`;
        
        try {
            const aiContent = await callGeminiAPI(prompt, imageToSend);
            const aiMessage = { id: Date.now().toString() + 'ai', role: 'model', content: aiContent };
            setMessages(prev => [...prev, aiMessage]);
            speakResponse(aiContent); // Speak the response
        } catch (error) {
            const errorMessage = { id: Date.now().toString() + 'err', role: 'model', content: `Error: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.flexOne}>
            <View style={styles.featureToggleBar}>
                 <TouchableOpacity onPress={handleLanguageToggle} style={styles.toggleButton}>
                    <Feather name="globe" size={20} color="#333" />
                    <Text style={styles.toggleText}>{language === 'en-US' ? 'EN' : 'HI'}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity onPress={handleVoiceOutputToggle} style={styles.toggleButton}>
                    <Feather name={isVoiceOutput ? "volume-2" : "volume-x"} size={20} color={isVoiceOutput ? "#2575fc" : "#333"} />
                    <Text style={[styles.toggleText, isVoiceOutput && {color: "#2575fc"}]}>Voice</Text>
                 </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef} style={styles.chatContainer} contentContainerStyle={styles.chatContentContainer} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
                {messages.map((msg) => (
                    <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
                        {msg.imageUri && <Image source={{ uri: msg.imageUri }} style={styles.messageImage} />}
                        {msg.content !== '' && <Text style={msg.role === 'user' ? styles.userMessageText : styles.botMessageText}>{msg.content}</Text>}
                    </View>
                ))}
                {isLoading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#2575fc" />}
            </ScrollView>

            <View style={styles.inputWrapper}>
                {pickedImage && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: pickedImage.uri }} style={styles.imagePreview} />
                        <TouchableOpacity onPress={() => setPickedImage(null)} style={styles.removeImageButton}>
                            <Feather name="x" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.iconButton} onPress={handlePickImage} disabled={isLoading}>
                        <Feather name="camera" size={24} color="#555" />
                    </TouchableOpacity>
                    <TextInput style={styles.chatInput} value={inputMessage} onChangeText={setInputMessage} placeholder="Type or hold mic to talk..." placeholderTextColor="#999" multiline editable={!isLoading} />
                    <TouchableOpacity style={styles.iconButton} onPressIn={startRecording} onPressOut={stopRecording} disabled={isLoading}>
                        <Feather name="mic" size={24} color={isRecording ? '#ff4d4d' : '#555'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.sendButton, isLoading && styles.disabledButton]} onPress={handleSendMessage} disabled={isLoading}>
                        <Feather name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// ... HealthTipsScreen and Main App component remain the same ...
const HealthTipsScreen = ({ onLogout }) => {
    const [tip, setTip] = useState('Tap the button below for a new wellness tip!');
    const [isTipLoading, setIsTipLoading] = useState(false);
    const fetchHealthTip = async () => {
        setIsTipLoading(true); setTip('');
        const prompt = `Provide a unique, interesting, and actionable wellness tip for today. Make it encouraging and easy to understand. Start with a catchy title in bold, like "**Today's Wellness Spark:**".`;
        try {
            setTip(await callGeminiAPI(prompt));
        } catch (error) {
            setTip(`Sorry, couldn't fetch a tip right now. ${error.message}`);
        } finally { setIsTipLoading(false); }
    };
    return (
        <View style={styles.tipsContainer}>
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.tipCard}>
                <View style={styles.tipCardContent}>
                    {isTipLoading ? <ActivityIndicator size="large" color="#fff" /> : <Text style={styles.tipText}>{tip}</Text>}
                </View>
            </LinearGradient>
            <TouchableOpacity style={styles.tipButton} onPress={fetchHealthTip} disabled={isTipLoading}>
                 <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.loginButtonGradient}>
                    <Text style={styles.tipButtonText}>Get New Tip</Text><Feather name="refresh-cw" size={20} color="white" />
                 </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [activeTab, setActiveTab] = useState('chat');
    const handleLogin = (name) => { setUsername(name); setIsLoggedIn(true); };
    const handleLogout = () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", onPress: () => { setUsername(''); setIsLoggedIn(false); setActiveTab('chat'); }}
        ]);
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            {!isLoggedIn ? <LoginScreen onLogin={handleLogin} /> : (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flexOne}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Hi, {username}!</Text>
                        <TouchableOpacity onPress={handleLogout}><Feather name="log-out" size={24} color="#333" /></TouchableOpacity>
                    </View>
                    <View style={styles.tabBar}>
                        <TouchableOpacity style={[styles.tab, activeTab === 'chat' && styles.activeTab]} onPress={() => setActiveTab('chat')}>
                            <Feather name="message-circle" size={20} color={activeTab === 'chat' ? '#FFF' : '#2575fc'} />
                            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Advisor Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, activeTab === 'tips' && styles.activeTab]} onPress={() => setActiveTab('tips')}>
                            <Feather name="heart" size={20} color={activeTab === 'tips' ? '#FFF' : '#2575fc'} />
                            <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>Health Tips</Text>
                        </TouchableOpacity>
                    </View>
                    {activeTab === 'chat' ? <ChatScreen username={username} /> : <HealthTipsScreen />}
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

// --- STYLESHEET (Updated for new features) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f0f4f8', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    flexOne: { flex: 1 },
    loginContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loginForm: { width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 25, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    logo: { width: 100, height: 100, marginBottom: 20, borderRadius: 20 },
    loginTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
    loginSubtitle: { fontSize: 16, color: '#555', marginBottom: 30, textAlign: 'center' },
    loginInput: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#DDD', color: '#333' },
    loginButton: { width: '100%', borderRadius: 10, overflow: 'hidden' },
    loginButtonGradient: { flexDirection: 'row', paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
    headerTitle: { fontSize: 22, fontWeight: '600', color: '#333' },
    tabBar: { flexDirection: 'row', padding: 5, marginHorizontal: 15, marginTop: 10, marginBottom: 5, borderRadius: 30, backgroundColor: '#FFF', justifyContent: 'space-around', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 25 },
    activeTab: { backgroundColor: '#2575fc' },
    tabText: { marginLeft: 8, fontSize: 16, color: '#2575fc', fontWeight: '600' },
    activeTabText: { color: '#FFF' },
    chatContainer: { flex: 1, backgroundColor: '#f0f4f8' },
    chatContentContainer: { paddingHorizontal: 10, paddingBottom: 10 },
    messageBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    userMessage: { backgroundColor: '#2575fc', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
    botMessage: { backgroundColor: '#FFF', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
    userMessageText: { color: 'white', fontSize: 16, lineHeight: 24 },
    botMessageText: { color: '#333', fontSize: 16, lineHeight: 24 },
    messageImage: { width: width * 0.6, height: width * 0.6, borderRadius: 15, marginBottom: 10, alignSelf: 'center' },
    loadingIndicator: { marginVertical: 20 },
    inputWrapper: { borderTopWidth: 1, borderTopColor: '#EAEAEA', backgroundColor: '#FFF', paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
    inputRow: { flexDirection: 'row', alignItems: 'center', padding: 10, },
    chatInput: { flex: 1, minHeight: 45, maxHeight: 120, backgroundColor: '#f0f4f8', borderRadius: 22, paddingHorizontal: 20, paddingTop: 12, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
    iconButton: { padding: 10 },
    sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#2575fc', justifyContent: 'center', alignItems: 'center', shadowColor: '#2575fc', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 4, marginLeft: 5 },
    disabledButton: { backgroundColor: '#B0C4DE', shadowOpacity: 0 },
    imagePreviewContainer: { position: 'relative', alignSelf: 'flex-start', margin: 10, },
    imagePreview: { width: 80, height: 80, borderRadius: 10, borderWidth: 2, borderColor: '#2575fc' },
    removeImageButton: { position: 'absolute', top: -10, right: -10, backgroundColor: '#ff4d4d', borderRadius: 15, width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    featureToggleBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eaeaea' },
    toggleButton: { flexDirection: 'row', alignItems: 'center', padding: 8, marginLeft: 15 },
    toggleText: { marginLeft: 5, fontWeight: '600', color: '#333' },
    tipsContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: 20, backgroundColor: '#f0f4f8' },
    tipCard: { width: '100%', height: height * 0.5, borderRadius: 30, padding: 5, shadowColor: '#6a11cb', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    tipCardContent: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 25, justifyContent: 'center', alignItems: 'center', padding: 25 },
    tipText: { fontSize: 22, color: 'white', fontWeight: 'bold', textAlign: 'center', lineHeight: 32, textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    tipButton: { width: '80%', borderRadius: 10, overflow: 'hidden' },
    tipButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
});
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the path as necessary
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import Footer from '../Home/Footer';
import Defaultbars from './Defaultbars';
import './AIAssistant.css';

axios.defaults.baseURL = 'http://localhost:5000'; // Ensure this points to your backend

function Assistant() {
    const vidas = {
        vidas: 'Gradient 2.mp4',
        send:"send.png",
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });
        return () => unsubscribe();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/service1/send-message', { message: input });
            console.log('Response from server:', response.data);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div className='assistant'>
            <Defaultbars />
            <video id="background-video" src={vidas.vidas} controls loop autoPlay muted></video>
            <div className='assub'>
                <div>
                    {messages.map((message, index) => (
                        <div key={index}>
                            <p>User: {message.message}</p>
                            <p>Response: {message.response}</p>
                        </div>
                    ))}   
                </div>
                <form onSubmit={sendMessage} className='chatai'>
                    <input value={input} onChange={(e) => setInput(e.target.value)} id='intext'
                    placeholder='Ask MeanAs any questions related to FEA/CFD Analysis tailored to your specific project...' 
                    required/>
                    <button type="submit" id='sendit'><img src={vidas.send} alt='send message'/></button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Assistant;

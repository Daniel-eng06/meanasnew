import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import axios from 'axios';
import Footer from '../Home/Footer';
import Defaultbars from './Defaultbars';
import './AI-Assistant.css';

// Set Axios base URL to your backend server
axios.defaults.baseURL = 'http://localhost:5000/service1';

function Assistant() {
    const vidas = {
        vidas: 'Gradient 2.mp4',
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const unsubscribe = db.collection('chats').orderBy('timestamp').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()));
        });
        return () => unsubscribe();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post('/send-message', { message: input });
        setInput('');
    };
    
    return(
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
                <form onSubmit={sendMessage}>
                    <input value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit">Send</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Assistant;

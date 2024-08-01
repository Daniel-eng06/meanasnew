import React, { useState, useEffect } from 'react';
import { storage, db } from '../../firebase'; // Ensure firebase is correctly initialized
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import Grid from '../../Grid';
import Footer from '../Home/Footer';
import Defaultbars from './Defaultbars';
import './TeamConnect.css';

function TeamConnect() {
    const vids = {
        vid1s: 'Gradient 2.mp4',
    };

    const [pdfs, setPdfs] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
  
    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        setSelectedPdf(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (!selectedPdf) return;
  
      const storageRef = ref(storage, `pdfs/${selectedPdf.name}`);
      await uploadBytes(storageRef, selectedPdf);
      const url = await getDownloadURL(storageRef);
  
      await addDoc(collection(db, 'pdfs'), {
        name: selectedPdf.name,
        url: url,
      });
  
      setPdfs([...pdfs, { name: selectedPdf.name, url: url }]);
      setSelectedPdf(null);
    };
  
    const shareViaEmail = (pdf) => {
      const subject = `Check out this PDF: ${pdf.name}`;
      const body = `Hi,\n\nI wanted to share this PDF with you: ${pdf.name}\n\nLink: ${pdf.url}\n\nBest regards,`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
  
    const shareViaWhatsApp = (pdf) => {
      const message = `Check out this PDF: ${pdf.name}\n\nLink: ${pdf.url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    };
    
    return(
        <div>
            <Grid/>
            <video id="background-video" src={vids.vid1s} controls loop autoPlay muted></video>
            <Defaultbars/>
            <div className='teamhub'>
                <h1>Share your project with your Team and Friends</h1>
                <div className="pdf-list">
                    <h2>Projects worked on</h2>
                    <ul>
                    {pdfs.map((pdf, index) => (
                        <li key={index}>
                        {pdf.name}
                        <button onClick={() => shareViaEmail(pdf)}>Share via Email</button>
                        <button onClick={() => shareViaWhatsApp(pdf)}>Share via WhatsApp</button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    )
};


export default TeamConnect;
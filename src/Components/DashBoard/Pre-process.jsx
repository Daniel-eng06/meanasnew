import React, { useState, useEffect } from 'react';
import './Pre-process.css';
import Footer from '../Home/Footer';
import Grid from '../../Grid';
import Defaultbars from './Defaultbars';
import { storage, auth } from '../../firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { onAuthStateChanged } from "firebase/auth";

function Preprocess() {
  const vid = {
    vid1: 'Gradient 2.mp4',
    pre: "pre-process.png",
  };

  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [option, setOption] = useState('');
  const [customOption, setCustomOption] = useState('');
  const [analysisType, setAnalysisType] = useState(''); 
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user is not authenticated, redirect to login/signup page
        navigate('/Authentication');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleMaterialsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMaterials((prevMaterials) => [...prevMaterials, value]);
    } else {
      setMaterials((prevMaterials) => prevMaterials.filter((material) => material !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (images.length > 0) {
      try {
        // Upload images to Firebase Storage
        const imageUrls = await Promise.all(images.map(async (image) => {
          const storageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        }));
  
        // Send data to the backend server
        const response = await axios.post('/preprocess', {
          description,
          imageUrls,
          materials,
          option,
          customOption,
          analysisType,
          timestamp: new Date(),
        });
  
        const { id, response: generatedResponse } = response.data;
  
        // Clear form inputs
        resetForm();
        setResponse(generatedResponse);
  
        alert('Images uploaded and processed successfully!');
        navigate(`/Projects/${id}`);
  
      } catch (error) {
        setLoading(false);
        console.error('Error uploading images and saving project:', error);
        alert('Failed to upload images and save project. Please try again.');
      }
    } else {
      setLoading(false);
      alert('Please select images to upload.');
    }
  };
  
  const resetForm = () => {
    setImages([]);
    setDescription('');
    setMaterials([]);
    setOption('');
    setCustomOption('');
    setAnalysisType('');
  };
  
  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      doc.text("Project Report", 10, 10);
      doc.text(`Description: ${description}`, 10, 20);
      doc.text(`Materials: ${materials.join(", ")}`, 10, 30);
      doc.text(`Analysis Type: ${analysisType}`, 10, 40);
      doc.text(`Preferred Software: ${option} ${customOption}`, 10, 50);
      
      const responseLines = response.split('\n');
      let yOffset = 60;
      responseLines.forEach(line => {
        doc.text(line, 10, yOffset);
        yOffset += 10;
      });
  
      const pdfBlob = doc.output("blob");
  
      const pdfRef = ref(storage, `reports/report_${new Date().getTime()}.pdf`);
      await uploadBytes(pdfRef, pdfBlob);
      const pdfURL = await getDownloadURL(pdfRef);
  
      const pdfBlobURL = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfBlobURL;
      downloadLink.download = "report.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  
      alert(`Report generated and uploaded successfully! URL: ${pdfURL}`);
    } catch (error) {
      console.error('Error generating or uploading PDF:', error);
      alert('Failed to generate or upload PDF. Please try again.');
    }
  };
  
  return (
    <div id='pre'>
      <video id="background-video" src={vid.vid1} controls loop autoPlay muted></video>
      <Grid />
      <Defaultbars />
      <div className='current'>
        <div><img src={vid.pre} alt="Pre-process" /></div>
        <h2>Clarity & Accuracy For Pre-Processing</h2>
      </div>
      <div className="preprocess">
        <form onSubmit={handleSubmit} className="image-form">
          <div className="form-group">
            <label htmlFor="imageUpload">Upload 3D CAD Images of Your Model:</label>
            <div className="custom-file-upload">
              <label htmlFor="imageUpload" id='hov'>
                <FaUpload size={30} />
              </label>
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageChange}
                multiple
                style={{ display: 'none' }}
                required
              />
            </div>
          </div>
          <div className="uploaded-images">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
                <button type="button" onClick={() => handleDeleteImage(index)}>
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor="description">What Are You Trying To Achieve?</label>
            <textarea
              type='text'
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Please describe briefly your project, goals and objectives... MeanAs can assist you throughout your specific project.'
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="analysisType">Select Analysis Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="FEA"
                  checked={analysisType === 'FEA'}
                  onChange={(e) => setAnalysisType(e.target.value)}
                />
                FEA
              </label>
              <label>
                <input
                  type="radio"
                  value="CFD"
                  checked={analysisType === 'CFD'}
                  onChange={(e) => setAnalysisType(e.target.value)}
                />
                CFD
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="materials">Select Recommendations for Materials:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Metals/Alloys"
                  onChange={handleMaterialsChange}
                />
                Metals
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Liquids"
                  onChange={handleMaterialsChange}
                />
                Liquids
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Polymers"
                  onChange={handleMaterialsChange}
                />
                Polymers
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Plastics"
                  onChange={handleMaterialsChange}
                />
                Plastics
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Composite"
                  onChange={handleMaterialsChange}
                />
                Composite
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Ceramics"
                  onChange={handleMaterialsChange}
                />
                Ceramics
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="option">Select A Preferred Analysis Software For Your Project:</label>
            <select id="option" value={option} onChange={(e) => setOption(e.target.value)} required>
              <option value="">Select an analysis software</option>
              <option value="ansys">Ansys</option>
              <option value="abaqus">Abaqus</option>
              <option value="comsol">Comsol</option>
              <option value="solidworks">Solidworks</option>
              <option value="openfoam">OpenFoam</option>
              <option value="fusion360">Fusion 360</option>
              <option value="other">Other</option>
            </select>
            {option === 'other' && (
              <input
                type='text'
                id="texti"
                value={customOption}
                onChange={(e) => setCustomOption(e.target.value)}
                placeholder='Type your custom option...'
                required
              />
            )}
          </div>
          <button type="submit" disabled={loading} id='newbut'>
            {loading ? 'Generating...' : 'Generate Clarity'}
          </button>
        </form>
      </div>
      <div className="response-container">
        <div className="response">
          {response || 'No response yet. Click "Generate Clarity" '}
        </div>
        <button className='report' onClick={generatePDF}>
          Generate Report
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Preprocess;

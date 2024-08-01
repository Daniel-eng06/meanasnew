import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Footer from "../Home/Footer";
import Defaultbars from './Defaultbars';
import './Projects.css'; 

function Projects() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div id='load'>Loading...</div>;
  }

  const vido ={
    vid1:"Gradient 2.mp4"
  };

  return (
        <div className='proj'>
            <video id="background-video"
                   src={vido.vid1} controls loop autoPlay muted>
            </video>
            <Defaultbars />
            <div className="project-page">
                <h2>Project Details</h2>
                <p>Description: {project.description}</p>
                <p>Analysis Type: {project.analysisType}</p>
                <p>Materials: {project.materials.join(', ')}</p>
                <p>Option: {project.option}</p>
                <div className="image-gallery">
                    {project.imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Project Image ${index + 1}`} />
                    ))}
                </div>
                <div className="responses">
                    <h3>Generated Responses</h3>
                    {project.responses.map((response, index) => (
                    <p key={index}>{response}</p>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
  );
}

export default Projects;

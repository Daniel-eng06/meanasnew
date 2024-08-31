import React, { useEffect, useState } from 'react';
import './Projects.css';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from '../Home/Footer';
import Defaultbars from './Defaultbars';

function Projects() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchProject = async () => {
      setLoading(true);

      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.log('No such project document!');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  if (loading) {
    return <div id='load'>Loading...</div>;
  }

  if (!project) {
    return <div id='load'>No project found or you are not authorized to view this project.</div>;
  }

  return (
    <div className="project-details">
      <Defaultbars />
        <h1>Project Details</h1>
        <h2>Description:</h2>
        <p>{project.description}</p>
        
        <h2>Materials:</h2>
        <ul>
          {project.materials.map((material, index) => (
            <li key={index}>{material}</li>
          ))}
        </ul>
        
        <h2>Analysis Type:</h2>
        <p>{project.analysisType}</p>
        
        <h2>Preferred Software:</h2>
        <p>{project.option} {project.customOption}</p>
        
        <h2>Images:</h2>
        <div className="image-gallery">
          {project.imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Project Image ${index + 1}`} />
          ))}
        </div>
        <h2>Generated Response:</h2>
        <p>{project.response}</p>
      <Footer />
    </div>
  );
}

export default Projects;

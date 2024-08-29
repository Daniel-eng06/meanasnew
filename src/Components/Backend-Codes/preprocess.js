import express from 'express';
import { getFirestore, collection, addDoc } from 'firebase-admin/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';

dotenv.config();

const router = express.Router();

// Initialize Firestore and Storage
const firestore = getFirestore();
const storage = getStorage();

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to make an API call to Claude
async function callClaudeAPI(imageUrls, promptText) {
  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: promptText
        },
        ...imageUrls.map(url => ({
          type: 'image',
          source: {
            type: 'url',
            url: url
          }
        }))
      ]
    }
  ];

  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    model: 'claude-3-sonnet-20240229',
    messages: messages
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.CLAUDE_API_KEY
    }
  });

  return response.data;
}

// Endpoint to handle data processing
router.post('/', upload.array('images'), async (req, res) => {
  try {
    const { description, materials, option, customOption, analysisType } = req.body;
    const files = req.files;

    // Validate input data
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Invalid description' });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Save data to Firestore
    const projectRef = await addDoc(collection(firestore, 'projects'), {
      description,
      materials: JSON.parse(materials),
      option,
      customOption,
      analysisType,
      timestamp: new Date(),
    });

    // Upload images to Firebase Storage and get their URLs
    const uploadedImageUrls = await Promise.all(files.map(async (file, index) => {
      try {
        const storageRef = ref(storage, `uploads/${projectRef.id}_${index}.jpg`);
        await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
        return await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image');
      }
    }));

    // Create the prompt text based on the analysis type
    let promptText;
    if (analysisType === 'FEA') {
      promptText = `
        Role: As a CAE expert, Senior Engineer in all engineering fields, and physicist with extensive knowledge in all kinds of analysis under FEA/CFD.
        Task: With this as my ${description}:

        1. Model Analysis and Geometry Cleanup:
          - Analyze the model in the provided images, focusing on geometry cleanup.
          - Check for errors, inconsistencies, and topological issues.
          - Provide solutions to perfect the model for further analysis.

        2. Analysis Type Recommendation:
          - Based on my role description, recommend the specific analysis type I should perform that aligns with my goal.

        3. Material Selection:
          - Suggest 3-5 materials from ${materials} that best suit my goal and select the materials from MatWeb, including full numerical properties for use specifically in my analysis. Example:
            - Stainless Steel
              - Density: 7.85 g/cm³
              - Tensile Strength: 515-720 MPa
              - Young's Modulus: 193 GPa
              - Thermal Conductivity: 16.2 W/mK
              - Electrical Conductivity: 1.45x10⁶ S/m
              - Melting Point: 1400-1450°C

        4. Mesh Quality and Critical Locations:
          - Identify critical locations on the model in the provided image that require high-quality meshing.
          - Provide mesh quality criteria for these areas. Example:
            - "At the top corner of the model where there is a hole, increase the mesh quality by using an element size of 0.1 at the edges."

        5. Boundary Conditions and Numerical Parameters:
          - Examine the model and suggest boundary conditions and numerical parameters for applied loads on specific areas in the provided images. Example:
            - "Consider applying a fixed support at the bolted areas on the left and right sides of the model."
            - "Consider applying a downward-facing load of 10N on the top layer of the model."
          - If possible, provide relevant calculations for the boundary conditions needed for the analysis, including loads, constraints, and supports.

        6. Roadmap and Analysis Recommendations:
          - Using all the provided data, create a clear and concise roadmap for conducting the analysis in ${option} ${customOption}.
          - Include detailed recommendations for the analysis process, focusing on achieving the best possible results for the specific model in the provided image.
        `;
    } else if (analysisType === 'CFD') {
      promptText = `
        Role: As a CAE expert, Senior Engineer in all engineering fields, and physicist with extensive knowledge in all kinds of analysis under FEA/CFD.
        Task: With this as my ${description}:
    
        1. Model Analysis and Geometry Cleanup:
          - Analyze the model in the provided images, focusing on geometry cleanup for fluid dynamics.
          - Check for errors, inconsistencies, and topological issues that could affect fluid flow simulations.
          - Provide solutions to perfect the model for accurate CFD analysis.
    
        2. Flow Domain and Boundary Condition Setup:
          - Based on my role description, recommend the appropriate flow domain setup, including inlet, outlet, and wall boundary conditions.
          - Specify any special boundary conditions that align with my goal, such as symmetry planes, periodic boundaries, or moving walls.
    
        3. Mesh Quality and Refinement:
          - Identify critical regions in the model where flow gradients are expected to be high (e.g., near walls, around obstacles, or at interfaces).
          - Recommend mesh refinement strategies for these regions, including boundary layer meshing and local grid refinement. Example:
            - "Refine the mesh near the leading edge of the airfoil with a minimum element size of 0.05 mm to capture the boundary layer effects accurately."
    
        4. Fluid Properties and Material Selection:
          - Suggest 3-5 fluid materials and materials from ${materials} that best suit the analysis goal, including properties such as viscosity, density, specific heat, and thermal conductivity.
          - Provide detailed numerical properties for the selected fluids from sources like MatWeb.
    
        5. Solver Settings and Numerical Parameters:
          - Recommend solver settings appropriate for the type of flow (laminar, turbulent, compressible, incompressible) and the specific objectives of the analysis.
          - Suggest turbulence models, time-stepping methods, or other solver parameters crucial for accurate results.
    
        6. Roadmap and Analysis Recommendations:
          - Using all the provided data, create a clear and concise roadmap for conducting the CFD analysis in ${option} ${customOption}.
          - Include recommendations for post-processing, such as monitoring convergence, visualizing flow fields, and extracting key performance indicators (e.g., pressure drop, drag, or heat transfer rates).
      `;
    } else {
      promptText = `
      The provided analysis type (${analysisType}) is not recognized or is invalid. Please specify a valid analysis type (e.g., 'FEA' for Finite Element Analysis or 'CFD' for Computational Fluid Dynamics) to proceed.
  
      Ensure the following details are included:
      - **Analysis Type**: Choose between 'FEA' or 'CFD'.
      - **Description**: Provide a brief description of the analysis.
      - **Materials**: Specify the materials used in the analysis.
      - **Option**: Specify any specific options or custom settings for the analysis.
      - **Custom Option**: Provide any additional custom details relevant to the analysis.
      - **Detail Level**: Indicate the level of detail required for the final report (e.g., High Student Level, Detailed Technical Insight, Marketing Level, Research Level).
  
      Completing all required fields will ensure accurate and effective analysis.
      `;
    }

    // Call Claude API to process images and the prompt
    const claudeResponse = await callClaudeAPI(uploadedImageUrls, promptText);
    const generatedResponse = claudeResponse.content[0].text;

    // Save the generated response to Firestore
    await addDoc(collection(firestore, 'responses'), {
      projectId: projectRef.id,
      generatedResponse,
      timestamp: new Date(),
    });

    res.status(200).json({ id: projectRef.id, response: generatedResponse });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: error.message || 'Failed to process data' });
  }
});

export default router;
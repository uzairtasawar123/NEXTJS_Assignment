"use client";
// import { storage } from './firebase'; // Adjust the import path

import { useState, useEffect, ChangeEvent } from 'react';
import { collection, addDoc, getDocs, DocumentData, onSnapshot } from 'firebase/firestore';
import { storage, db } from './firebaseconfig'; // Your Firebase setup
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from '@mui/material';

interface Project {
  id?: string;
  name: string;
  description: string;
  image: File | null;
}

const ProjectScreen: React.FC = () => {
  const imageUrl = "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({
    name: '',
    description: '',
    image: null,
  });
  const [openNewProjectModal, setOpenNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [image, setImage] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);

  console.log("Projs====>", projects);
  // Fetch all projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'nextjsassignment'));
      const unsubscribe = onSnapshot(collection(db, 'nextjsassignment'), (querySnapshot) => {
        setProjects(
          querySnapshot.docs.map((doc: DocumentData) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      });

      // Cleanup the listener on component unmount
      return () => unsubscribe();
    };
    fetchProjects();
  }, []);

  // Handle input change for new project
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      // Create a preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    }
  };
  const handleUpload = async () => {
    debugger
    const imageeeeee = image;
    const storageRef = ref(storage, `images/${image.name}`); // Create a reference in Firebase Storage

    try {
      const reader = new FileReader();

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, image);

      // Get the image URL after uploading
      const url = await getDownloadURL(storageRef);
      // setImageURL(url);

      // Save the name, description, and image URL in Firestore
      await addDoc(collection(db, 'items'), {
        name: newProject.name,
        description: newProject.description,
        imageUrl: url,
        // uploadedAt: new Date(),
      });

      alert('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data: ', error);
    } finally {
      // setUploading(false);
    }
  };
  // const handleImageUpload = async (e: any) => {
  //   debugger
  //   const file = e.target.files[0]; // Assuming you have an input file element
  //   const storageRef = storage.ref("images/your-image-name.jpg"); // Replace with your desired path

  //   storageRef.put(file)
  //     .then((snapshot:any) => {
  //       // Handle successful upload
  //       console.log("Uploaded file: ", snapshot.ref.fullPath);

  //       // Get the download URL of the uploaded image
  //       snapshot.ref.getDownloadURL()
  //         .then((url:any) => {
  //           // Do something with the download URL, e.g., store it in your database
  //           console.log("Download URL: ", url);
  //         })
  //         .catch((error:any) => {
  //           console.error("Error getting download URL: ", error);
  //         });
  //     })
  //     .catch((error:any) => {
  //       console.error("Error uploading file: ", error);
  //     });

  //   // Check if files exist and ensure the array is not empty
  //   //const file = e.target.files[0]; // Get the first selected file


  // };

  // const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setNewProject((prevState) => ({
  //       ...prevState,
  //       image: e.target.files?[0],
  //     }));
  //   }
  // };

  // Add a new project to Firestore
  const addNewProject = async () => {

    debugger
    if (newProject.name && newProject.description) {
      await addDoc(collection(db, 'nextjsassignment'), newProject);
      setOpenNewProjectModal(false);
      setNewProject({ name: '', description: '', image: null });
    }
  };

  // Open the new project modal
  const handleOpenNewProjectModal = () => {
    setOpenNewProjectModal(true);
  };

  // Close the new project modal
  const handleCloseNewProjectModal = () => {
    setOpenNewProjectModal(false);
  };

  // Open the selected project details in a modal
  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
  };

  // Close the project details modal
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <div className="container">
      <h1>Project Dashboard</h1>

      {/* Add New Project Button */}
      <Button
        variant="contained"
        color="primary"
        className="add-project-button"
        onClick={handleOpenNewProjectModal}
      >
        Add New Project
      </Button>

      {/* Project Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="table-row"
                hover
                onClick={() => openProjectDetails(project)}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Project Modal */}
      <Dialog open={openNewProjectModal} onClose={handleCloseNewProjectModal}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            name="name"
            value={newProject.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
          <input type="file" onChange={handleImageUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewProjectModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={addNewProject} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onClose={closeProjectDetails}>
        <DialogTitle>Project Details</DialogTitle>
        {selectedProject && (
          <DialogContent>
            <h2>{selectedProject.name}</h2>
            <p>{selectedProject.description}</p>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={closeProjectDetails} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectScreen;

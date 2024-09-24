import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Firebase connection
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, TextField } from '@mui/material';

export default function ProjectScreen() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'nextjsassignment'));
      setProjects(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchProjects();
  }, []);

  const addNewProject = async () => {
    await addDoc(collection(db, 'nextjsassignment'), newProject);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add New Project</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <TextField label="Project Name" onChange={e => setNewProject({ ...newProject, name: e.target.value })} />
        <TextField label="Description" onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
        <Button onClick={addNewProject}>Add Project</Button>
      </Dialog>
    </>
  );
}

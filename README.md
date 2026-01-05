# Web Editor (VS Code–like Collaborative Editor)

## Overview
This is a browser-based code editor inspired by VS Code, designed to allow users to:
- Create projects
- Manage files and folders
- Edit multiple files with syntax highlighting
- Collaborate in real-time with other users

The project is currently centralized, with Socket.IO powering real-time collaboration.  
Future plans include decentralization, offline support, and end-to-end encryption.

Live Demo: [https://web-editor-one.vercel.app/](https://web-editor-one.vercel.app/)  
GitHub Repo: [https://github.com/Ballursajeed/web-editor](https://github.com/Ballursajeed/web-editor)

---

## Features

### Core Features
- Project creation
- File and folder management (CRUD)
- Multi-file editing with Monaco Editor
- Syntax highlighting for JS, TS, Python, HTML, CSS, etc.
- Language icons for easy identification
- User authentication (sign up / login)
- Personalized dashboard showing user projects

### Real-Time Collaboration
- Session-based sharing (unique links)
- Role-based access (Viewer / Editor)
- Live code sync (basic Socket.IO prototype)
- Multi-cursor tracking with usernames
- Live presence awareness (who is online)

### Current Limitations
- Cursor desync occurs with rapid typing
- Conflict resolution for simultaneous edits not fully implemented
- Offline editing and decentralized syncing are planned but not yet implemented

---

## Tech Stack

**Frontend:** React, Monaco Editor, Socket.IO-client, Vite  
**Backend:** Node.js, Express, Socket.IO-server, MongoDB  
**Authentication:** JWT + Cookies  
**Deployment:** Vercel (Frontend), Node.js server

---

## Architecture (High-Level)

1. **Frontend**  
   - React + Monaco Editor for the editor interface  
   - File explorer UI displays projects, folders, and files  
   - Sends edits and cursor moves via Socket.IO to backend  

2. **Backend**  
   - Express server with REST APIs for projects, files, and folders  
   - MongoDB stores hierarchical project data with parentId references  
   - Socket.IO manages real-time communication in sessions  

3. **Real-Time Flow**  
   - Users join a session via a unique link  
   - Editor changes are emitted to the server (`edits`)  
   - Server broadcasts changes to all connected collaborators  
   - Cursor positions are tracked and updated live  

---

## How to Use

1. Sign up / login  
2. Create a new project  
3. Add folders and files  
4. Edit code with syntax highlighting  
5. Share project session link with collaborators (role-based access)  
6. See live edits and cursor movements (experimental)

---

## Future Work

- Fix cursor desync and optimize live collaboration  
- Offline editing with automatic sync  
- Decentralized peer-to-peer collaboration  
- End-to-end encryption for secure editing  
- CRDT/Y.js integration for conflict resolution and scalability

---

## Demo Videos
Videos showing feature progress are available via LinkedIn posts.  

- Initial features: Core editor, folder structure, multi-file editing  
- Later features: Real-time collaboration, session management, cursor tracking, role-based access

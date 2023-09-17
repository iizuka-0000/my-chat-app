import { io } from 'socket.io-client';
import { memo, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { AppBar, Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:5000')

const AllMessage = memo(({ messageList }) => {
  return (<List sx={{ width: '90%', maxWidth: 1000, bgcolor: 'background.paper', mx: 'auto', mt: 2 }}>
    {messageList.map((message_text) => (
      <ListItem key={message_text.messageID}>
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
        <ListItemText primary={message_text.message} secondary={message_text.userName} />
      </ListItem>
    ))}
  </List>);
})

function App() {
  const [newMessage, setNewMessage] = useState('');
  const [allChatMessageList, setAllChatMessageList] = useState([]);
  const [userName, setUserName] = useState('Liam');
  const [userID, setUserID] = useState(0);

  useEffect(() => {
    setUserID(Math.floor(Math.random() * 10000));
    document.title = 'My Chat App';
  }, [])

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.length >= 1) {
      const message_id = 'M:' + uuidv4();
      socket.emit('send_message', { messageID: message_id, uid: userID, userName: userName, message: newMessage });
      setNewMessage('');
    }
  }

  socket.on('existing_message', (data) => {
    setAllChatMessageList(data);
  })

  socket.on('return_message', (data) => {
    setAllChatMessageList([data, ...allChatMessageList]);
  })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <Typography variant='h6' color='inherit' component='div'>
            My Chat App
          </Typography>
        </Toolbar>
      </AppBar>
      <Box>
        <TextField sx={{ ml: '10%', my: 5 }} id='name' label='My name' variant='outlined' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
        <TextField sx={{ ml: 4, my: 5 }} id='userId' label='User ID (default: random)' variant='outlined' value={userID} />
        <TextField sx={{ width: '80%', mx: '10%' }} fullWidth label='Enter new message' id='newMessage' value={newMessage} onChange={(e) => { setNewMessage(e.target.value) }} />
        <Button sx={{ width: 100, mx: '10%', my: 1 }} variant='outlined' onClick={(e) => { sendMessage(e) }}>Send</Button>
      </Box>
      <AllMessage messageList={allChatMessageList} />
    </Box>
  );
}

export default App;

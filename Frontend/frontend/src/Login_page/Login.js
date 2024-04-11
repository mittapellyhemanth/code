import React, { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function SignIn() {
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token,setToken] = useState('')
  const handleVerifyEmail = async () => {
    try {
      const response = await axios.post('http://localhost:8080/verify-email', { email });
      if (response && response.data && response.data.Token) {
        setFlag(true);
        setError(null)
        setToken(response.data.Token)
        console.log(response.data);
      } else {
        console.error("Response or response data is undefined or token is missing.");
      }
    } catch (error) {
      console.error("Error:", error,flag);
      if (error.response && error.response.data && error.response.data.email_error) {
        setError(error.response.data.email_error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
     
      const response = await axios.post('http://localhost:8080/verify-code', { email, otp },{
        headers: {
          Authorization: token,
        },
      });
      // console.log(response.data,token);
      // Handle response from the backend
    } catch (error) {
      // console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
    if(error.response.data.email_error){
setError(error.response.data.error);
    }
 setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
            <LockOutlinedIcon />
          </Avatar>
         <Typography variant="body1" sx={{ mt: 1, color: 'red' }}>{error}</Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {flag && 
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter 6 digits OTP"
                name="otp"
                autoComplete="otp"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            }
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={!flag ? handleVerifyEmail : handleVerifyOTP}
              disabled={!email || (flag && !otp)} // Disable the button if email field is empty or if OTP is empty when flag is true
            >
              {!flag ? 'Get OTP' : 'Sign In'}
            </Button>
            {flag && (
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 1 , textTransform: 'none'}}
                onClick={handleVerifyEmail}
              >
                Resend OTP
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

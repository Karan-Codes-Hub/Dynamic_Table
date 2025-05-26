// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { styled } from '@mui/system';
// import { 
//   TextField, 
//   Button, 
//   Typography, 
//   Box, 
//   Grid, 
//   Container,
//   Divider,
//   IconButton,
//   useTheme
// } from '@mui/material';
// import {
//   LinkedIn,
//   GitHub,
//   Email,
//   Phone,
//   LocationOn,
//   Send
// } from '@mui/icons-material';

// const ContactContainer = styled(Container)(({ theme }) => ({
//   padding: theme.spacing(8, 0),
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
// }));

// const FormCard = styled(motion.div)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: '20px',
//   padding: theme.spacing(5),
//   boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
//   width: '100%',
//   border: `1px solid ${theme.palette.divider}`,
//   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//     boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.12)',
//   },
// }));

// const ContactHeader = styled(Typography)(({ theme }) => ({
//   marginBottom: theme.spacing(4),
//   position: 'relative',
//   fontWeight: 700,
//   color: theme.palette.text.primary,
//   '&:after': {
//     content: '""',
//     position: 'absolute',
//     bottom: -12,
//     left: 0,
//     width: '80px',
//     height: '5px',
//     background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//     borderRadius: '3px',
//   },
// }));

// const SubmitButton = styled(motion(Button))(({ theme }) => ({
//   marginTop: theme.spacing(3),
//   padding: theme.spacing(1.5, 3),
//   borderRadius: '12px',
//   fontWeight: 600,
//   letterSpacing: '0.5px',
//   textTransform: 'none',
// }));

// const ContactInfoItem = styled(motion.div)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   padding: theme.spacing(2.5),
//   borderRadius: '12px',
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//     transform: 'translateX(5px)',
//   },
// }));

// const SocialIconButton = styled(IconButton)(({ theme }) => ({
//   backgroundColor: theme.palette.background.default,
//   borderRadius: '12px',
//   padding: theme.spacing(1.5),
//   marginRight: theme.spacing(1),
//   transition: 'all 0.3s ease',
//   '&:hover': {
//     backgroundColor: theme.palette.primary.light,
//     color: theme.palette.primary.contrastText,
//   },
// }));

// const Contact = () => {
//   const theme = useTheme();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     // Simulate form submission
//     setTimeout(() => {
//       console.log('Form submitted:', formData);
//       setIsSubmitting(false);
//       setFormData({ name: '', email: '', message: '' });
//     }, 1500);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         ease: [0.4, 0, 0.2, 1],
//       },
//     },
//   };

//   const buttonVariants = {
//     hover: {
//       scale: 1.03,
//       boxShadow: `0px 8px 20px ${theme.palette.primary.main}20`,
//     },
//     tap: {
//       scale: 0.98,
//     },
//   };

//   const formFieldVariants = {
//     focus: {
//       scale: 1.01,
//       transition: { duration: 0.2 },
//     },
//   };

//   return (
//     <ContactContainer maxWidth="lg">
//       <Grid container spacing={6} alignItems="center" justifyContent="center">
//         {/* Left Column - Contact Form */}
//         <Grid item xs={12} md={6}>
//           <FormCard
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             whileHover={{ scale: 1.005 }}
//           >
//             <ContactHeader variant="h3" component="h1" gutterBottom>
//               Get In Touch
//             </ContactHeader>
            
//             <form onSubmit={handleSubmit}>
//               <motion.div variants={itemVariants}>
//                 <TextField
//                   fullWidth
//                   label="Your Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   margin="normal"
//                   variant="outlined"
//                   required
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                     },
//                   }}
//                   component={motion.div}
//                   whileFocus="focus"
//                   variants={formFieldVariants}
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <TextField
//                   fullWidth
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   margin="normal"
//                   variant="outlined"
//                   required
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                     },
//                   }}
//                   component={motion.div}
//                   whileFocus="focus"
//                   variants={formFieldVariants}
//                 />
//               </motion.div>
              
//               <motion.div variants={itemVariants}>
//                 <TextField
//                   fullWidth
//                   label="Your Message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   margin="normal"
//                   variant="outlined"
//                   multiline
//                   rows={5}
//                   required
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '12px',
//                     },
//                   }}
//                   component={motion.div}
//                   whileFocus="focus"
//                   variants={formFieldVariants}
//                 />
//               </motion.div>
              
//               <SubmitButton
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 endIcon={<Send />}
//                 disabled={isSubmitting}
//                 variants={buttonVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//               >
//                 {isSubmitting ? 'Sending...' : 'Send Message'}
//               </SubmitButton>
//             </form>
//           </FormCard>
//         </Grid>

//         {/* Right Column - Contact Info */}
//         <Grid item xs={12} md={6}>
//           <Box
//             component={motion.div}
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//           >
//             <motion.div variants={itemVariants}>
//               <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
//                 Contact Information
//               </Typography>
//               <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
//                 Have a project in mind or want to collaborate? Reach out through any of these channels. 
//                 I typically respond within 24 hours.
//               </Typography>
//               <Divider sx={{ my: 4, borderColor: 'divider' }} />
//             </motion.div>

//             <ContactInfoItem variants={itemVariants}>
//               <Email color="primary" sx={{ fontSize: 32, mr: 3 }} />
//               <Box>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
//                   Email
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary">
//                   karan@example.com
//                 </Typography>
//               </Box>
//             </ContactInfoItem>

//             <ContactInfoItem variants={itemVariants}>
//               <Phone color="primary" sx={{ fontSize: 32, mr: 3 }} />
//               <Box>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
//                   Phone
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary">
//                   +1 (555) 123-4567
//                 </Typography>
//               </Box>
//             </ContactInfoItem>

//             <ContactInfoItem variants={itemVariants}>
//               <LocationOn color="primary" sx={{ fontSize: 32, mr: 3 }} />
//               <Box>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
//                   Location
//                 </Typography>
//                 <Typography variant="body1" color="text.secondary">
//                   San Francisco, CA
//                 </Typography>
//               </Box>
//             </ContactInfoItem>

//             <motion.div variants={itemVariants} style={{ marginTop: '2.5rem' }}>
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
//                 Connect with me
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <SocialIconButton 
//                   href="https://www.linkedin.com/in/karanmishra01/" 
//                   target="_blank"
//                   color="primary"
//                   component={motion.a}
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <LinkedIn fontSize="large" />
//                 </SocialIconButton>
//                 <SocialIconButton 
//                   href="https://github.com/Karan-Codes-Hub" 
//                   target="_blank"
//                   color="primary"
//                   component={motion.a}
//                   whileHover={{ scale: 1.1, rotate: -5 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <GitHub fontSize="large" />
//                 </SocialIconButton>
//               </Box>
//             </motion.div>
//           </Box>
//         </Grid>
//       </Grid>
//     </ContactContainer>
//   );
// };

// export default Contact;
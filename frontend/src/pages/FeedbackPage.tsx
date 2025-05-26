import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Rating,
  Avatar,
  Divider,
  Chip,
  useTheme,
  Stack
} from '@mui/material';
import {
  Send,
  ThumbUp,
  Code,
  DesignServices,
  BugReport,
  Lightbulb,
  CheckCircle
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const FeedbackPage = () => {
  const theme = useTheme();
  const [rating, setRating] = useState<any>(0);
  const [feedback, setFeedback] = useState<any>('');
  const [feedbackType, setFeedbackType] = useState<any>('general');
  const [isSubmitting, setIsSubmitting] = useState<any>(false);
  const [submitted, setSubmitted] = useState<any>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log({
        rating,
        feedback,
        feedbackType
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setRating(0);
      setFeedback('');
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: theme.shadows[8],
    },
  };

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: <BugReport />, color: 'error' },
    { id: 'feature', label: 'Feature Request', icon: <Lightbulb />, color: 'primary' },
    { id: 'design', label: 'Design Feedback', icon: <DesignServices />, color: 'secondary' },
    { id: 'code', label: 'Code Quality', icon: <Code />, color: 'info' },
    { id: 'general', label: 'General Feedback', icon: <ThumbUp />, color: 'success' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box textAlign="center" mb={8}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                position: 'relative',
                display: 'inline-block',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  borderRadius: '2px',
                }
              }}
            >
              Share Your Feedback
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 3, maxWidth: '600px', mx: 'auto' }}>
              Help us improve our React Data Table component with your valuable insights
            </Typography>
          </motion.div>
        </Box>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Box
              textAlign="center"
              p={6}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '16px',
                boxShadow: theme.shadows[4],
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              <Avatar sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.success.light,
                color: theme.palette.success.main,
                mb: 3,
                mx: 'auto'
              }}>
                <CheckCircle sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                Thank You!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 4 }}>
                Your feedback has been submitted successfully. We truly appreciate your time and will use your input to make our component even better.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setSubmitted(false)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                  }
                }}
              >
                Submit Another Feedback
              </Button>
            </Box>
          </motion.div>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 5,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '16px',
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                  Rate Your Experience
                </Typography>

                <Box display="flex" justifyContent="center" mb={4}>
                  <Rating
                    name="feedback-rating"
                    value={rating}
                    onChange={(newValue) => setRating(newValue)}
                    size="large"
                    icon={
                      <ThumbUp
                        fontSize="inherit"
                        sx={{
                          color: theme.palette.primary.main,
                        }}
                      />
                    }
                    emptyIcon={
                      <ThumbUp
                        fontSize="inherit"
                        sx={{
                          color: theme.palette.action.disabled,
                          transform: 'translateY(2px)'
                        }}
                      />
                    }
                  />
                </Box>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Feedback Type
                </Typography>

                <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
                  {feedbackTypes.map((type) => (
                    <Chip
                      key={type.id}
                      icon={type.icon}
                      label={type.label}
                      clickable
                      color={feedbackType === type.id ? type.color : 'default'}
                      variant={feedbackType === type.id ? 'filled' : 'outlined'}
                      onClick={() => setFeedbackType(type.id)}
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        px: 1.5,
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  label="Your Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.light,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
                      },
                    },
                  }}
                />
                <Tooltip title="Will be enabled soon" placement="top">
                  <span>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<SendIcon />}
                      disabled={true}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        textTransform: 'none',
                        mt: 'auto',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}30`,
                        },
                        '&.Mui-disabled': {
                          backgroundColor: (theme) => theme.palette.action.disabledBackground,
                          color: (theme) => theme.palette.action.disabled
                        }
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </span>
                </Tooltip>
              </Box>

            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    p: 5,
                    height: '100%',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '16px',
                    boxShadow: theme.shadows[2],
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    What We're Looking For
                  </Typography>

                  <Stack spacing={3} mb={4}>
                    {/* Bug Report */}
                    <Box display="flex" alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.error.light,
                          color: theme.palette.error.main,
                          mr: 2,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <BugReport />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'left', pt: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Bug Reports
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Found an issue? Please include steps to reproduce, expected vs actual behavior, and any error messages.
                        </Typography>
                      </Box>
                    </Box>

                    {/* Feature Requests */}
                    <Box display="flex" alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          color: theme.palette.primary.main,
                          mr: 2,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <Lightbulb />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'left', pt: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Feature Requests
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          What functionality would make this component more useful? Explain your use case.
                        </Typography>
                      </Box>
                    </Box>

                    {/* Design Feedback */}
                    <Box display="flex" alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.secondary.light,
                          color: theme.palette.secondary.main,
                          mr: 2,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <DesignServices />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'left', pt: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Design Feedback
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          How can we improve the visual design, usability, or accessibility?
                        </Typography>
                      </Box>
                    </Box>

                    {/* Code Quality */}
                    <Box display="flex" alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.info.light,
                          color: theme.palette.info.main,
                          mr: 2,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <Code />
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'left', pt: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Code Quality
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Suggestions for improving the implementation, performance, or API design?
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 4, borderColor: 'divider' }} />

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Tips for Effective Feedback
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      color: 'text.secondary',
                      textAlign: 'left', // Ensure text is left-aligned
                      '& li': {
                        mb: 2,
                        position: 'relative',
                        pl: 2,
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '0.6em',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    <li>
                      <Typography variant="body2">Be specific and include examples where possible</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Explain the problem you're trying to solve</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Suggest concrete alternatives for improvements</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Keep feedback constructive and professional</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">Include screenshots or code snippets if relevant</Typography>
                    </li>
                  </Box>

                </Box>
              </motion.div>
            </Grid>

          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default FeedbackPage;
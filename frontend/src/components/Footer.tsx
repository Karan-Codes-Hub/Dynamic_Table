import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const footerStyle = {
  backgroundColor: '#f8f9fa', // light gray
  borderTop: '1px solid #dee2e6',
  padding: '1rem 2rem',
  boxShadow: '0 -2px 6px rgba(0,0,0,0.05)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const linkStyle = {
  color: '#6c757d',
  transition: 'color 0.3s ease, transform 0.3s ease',
  display: 'flex',
  alignItems: 'center',
};

const linkHover = {
  color: '#0d6efd', // Bootstrap primary blue
  transform: 'scale(1.1)',
};

const SocialLinks = [
  {
    href: 'https://www.linkedin.com/in/karan-mishra-345a9b1a0/',
    title: 'LinkedIn',
    icon: LinkedInIcon,
    key: 'linkedin',
  },
  {
    href: 'https://github.com/Karan-Codes-Hub',
    title: 'GitHub',
    icon: GitHubIcon,
    key: 'github',
  },
  {
      href: 'mailto:karankantm@gmail.com',
      title: 'Email',
      icon: EmailIcon,
      key: 'email',
      color: '#d44638',
    },
]
const Footer = () => {
  // For hover effect using React state (optional)
  const [hovered, setHovered] = React.useState<any>(null);

  return (
    <footer style={footerStyle}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ maxWidth: '960px', margin: '0 auto' }}
      >

        <span style={{ color: '#6c757d', fontWeight: '500' }}>
          Made by <strong style={{ color: '#212529' }}>Karan Mishra</strong>
        </span>

        <div className="d-flex gap-4">
          {SocialLinks.map(({ href, title, icon: Icon, key }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={title}
              style={{
                ...linkStyle,
                ...(hovered === key ? linkHover : {}),
              }}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              aria-label={title}
            >
              <Icon fontSize="large" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

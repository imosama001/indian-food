import { Box, Heading, Text, Button } from 'grommet';
import { Home } from 'grommet-icons';
import { Link } from 'wouter';

function NotFoundPage() {
  return (
    <Box fill align="center" justify="center" pad="large">
      <Box align="center" gap="medium">
        <Text size="xxlarge">🍽️</Text>
        <Heading level={2} margin="none" textAlign="center">
          Page Not Found
        </Heading>
        <Text textAlign="center" color="neutral-3">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link href="/">
          <Button 
            icon={<Home />} 
            label="Back to Home" 
            primary 
            margin={{ top: 'medium' }}
          />
        </Link>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
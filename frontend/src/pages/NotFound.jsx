import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-6xl font-poppins font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold text-darkText mb-4">Page Not Found</h2>
      <p className="text-mutedGray mb-8 max-w-md">
        The recipe or page you are looking for doesn't exist, has been moved, or you don't have permission to view it.
      </p>
      <Link to="/" className="bg-primary hover:bg-primaryHover text-cardWhite font-bold py-3 px-8 rounded-lg transition-colors">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
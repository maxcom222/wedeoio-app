import Header from './Header';

const Playerlayout: React.FC<any> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header />
      {children}
    </div>
  );
};

export default Playerlayout;

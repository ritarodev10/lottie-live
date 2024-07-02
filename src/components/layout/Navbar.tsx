import { Card } from "../ui/card";

const Navbar = () => {
  return (
    <div className="relative flex items-center p-4">
      <Card className="absolute left-4 bg-white p-4 w-1/4">
        {/* Left card content goes here */}
      </Card>
      <Card className="mx-auto bg-white p-4  w-1/4">
        {/* Center card content goes here */}
      </Card>
      <Card className="absolute right-4 bg-white p-4 w-1/6">
        {/* Right card content goes here */}
      </Card>
    </div>
  );
};

export default Navbar;

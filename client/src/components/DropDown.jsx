import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import PropTypes from "prop-types";
// import DeleteUser from './DeleteUser';
import UpdateUser from './UpdateUser';


Dropdown.propTypes = {
  data: PropTypes.func.isRequired,
};

function Dropdown({data}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-1 text-base font-medium rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
      >
        <Ellipsis />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div>
            <UpdateUser data={data} />
          </div>
          <div>
            {/* <DeleteUser data={data} /> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;

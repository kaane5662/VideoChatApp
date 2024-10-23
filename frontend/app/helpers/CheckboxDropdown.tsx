"use client"
import React, { useState } from 'react';
import { FaCaretDown, FaPlus } from 'react-icons/fa';

const CheckboxDropdown = ({ options, onSelectionChange,title,checked }:{options:string[], onSelectionChange:Function,title:string,checked:string[]| null}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(checked || []);

  const handleCheckboxChange = (option:string) => {
    let updatedSelections = [];
    if (selectedOptions.includes(option)) {
      
      updatedSelections = selectedOptions.filter((o) => o !== option);
    } else {
      
      updatedSelections = [...selectedOptions, option];
    }
    setSelectedOptions(updatedSelections);
    onSelectionChange(updatedSelections, title); 
  };

  return (
    <div className="relative w-full bg-white text-secondary">
      <button className="dropdown-toggle border-2 p-2 rounded-md w-full flex text-center justify-center gap-2 justify-between  items-center text-sm" onClick={() => setIsOpen(!isOpen)}>{title} <FaCaretDown scale={20}/></button>
      {isOpen && (
        <div className=" absolute bg-white w-full p-4 rounded-sm z-50 shadow-md overflow-y-scroll max-h-[250px]">
          {options.map((option) => (
            <div key={option} className="flex gap-4 text-md items-center ">
              
                <input className='w-4 h-4 rounded-xl bg-secondary '
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;

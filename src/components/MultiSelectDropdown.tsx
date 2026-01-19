import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import './MultiSelectDropdown.css';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  renderOption?: (option: string) => React.ReactNode;
  maxHeight?: number;
}

function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...',
  renderOption,
  maxHeight = 300,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectAll = () => {
    onChange([...options]);
  };

  return (
    <div className="multiselect-container" ref={dropdownRef}>
      <label className="multiselect-label">{label}</label>

      <div className="multiselect-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <div className="multiselect-input">
          {selectedValues.length === 0 ? (
            <span className="multiselect-placeholder">{placeholder}</span>
          ) : (
            <div className="multiselect-tags">
              {selectedValues.map((value) => (
                <span key={value} className="multiselect-tag">
                  {renderOption ? renderOption(value) : value}
                  <button
                    className="multiselect-tag-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(value);
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="multiselect-actions">
          {selectedValues.length > 0 && (
            <button className="multiselect-clear" onClick={clearAll} title="Clear all">
              <X size={16} />
            </button>
          )}
          <ChevronDown
            className={`multiselect-chevron ${isOpen ? 'open' : ''}`}
            size={20}
          />
        </div>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown" style={{ maxHeight }}>
          <div className="multiselect-dropdown-header">
            <button
              className="multiselect-dropdown-action"
              onClick={selectAll}
              disabled={selectedValues.length === options.length}
            >
              Select All
            </button>
            <button
              className="multiselect-dropdown-action"
              onClick={() => onChange([])}
              disabled={selectedValues.length === 0}
            >
              Clear All
            </button>
          </div>

          <div className="multiselect-options">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <div
                  key={option}
                  className={`multiselect-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  <div className="multiselect-checkbox">
                    {isSelected && <Check size={16} />}
                  </div>
                  <div className="multiselect-option-label">
                    {renderOption ? renderOption(option) : option}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;

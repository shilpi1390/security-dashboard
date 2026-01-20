import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { X } from "lucide-react";

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
  placeholder = "Select...",
  renderOption,
}: MultiSelectDropdownProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  const handleDelete = (valueToDelete: string) => {
    onChange(selectedValues.filter((value) => value !== valueToDelete));
  };

  const shouldShrink = isFocused || selectedValues.length > 0;

  return (
    <FormControl fullWidth size="small">
      <InputLabel
        id={`${label}-label`}
        shrink={shouldShrink}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        multiple
        value={selectedValues}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        input={
          <OutlinedInput
            label={shouldShrink ? label : ""}
            notched={shouldShrink}
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={renderOption ? renderOption(value) : value}
                size="small"
                onDelete={() => handleDelete(value)}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
                deleteIcon={
                  <X
                    size={14}
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
                sx={{
                  height: 24,
                  color: "primary.main",
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
        displayEmpty
        sx={{
          "& .MuiSelect-select": {
            minHeight: "40px",
          },
        }}
      >
        {selectedValues.length === 0 && (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox
              checked={selectedValues.includes(option)}
              size="small"
              sx={{
                color: "text.secondary",
                "&.Mui-checked": {
                  color: "primary.main",
                },
              }}
            />
            <ListItemText
              primary={renderOption ? renderOption(option) : option}
              slotProps={{
                primary: {
                  fontSize: "0.875rem",
                },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiSelectDropdown;

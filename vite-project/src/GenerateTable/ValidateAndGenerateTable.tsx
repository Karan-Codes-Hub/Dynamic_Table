import React, { forwardRef, Ref} from "react";
import GenerateTable , {TextInputRef} from "./GenerateTable"; // Adjust the import path as needed
import { GenerateTableProps } from "./types";

// Function to test `customRowStyle`
const testCustomRowStyle = (fn: (index: number) => string) => {
  if (typeof fn !== "function") {
    return "Invalid function: customRowStyle must be a function.";
  }
  for (let i = 0; i < 5; i++) {
    const result = fn(i);
    if (typeof result !== "string") {
      return `Invalid return type in customRowStyle: Expected string, got ${typeof result}`;
    }
  }

  return null; 
};
// Middleware function to validate props

const validateProps = (props: GenerateTableProps): string[] => {
    const errors: string[] = [];
    const {
      isHiddenColumnsAllowed,
      enableDragandDrop,
      isPaginationAllowed,
      isScrollAllowed,
      isSearchAllowed,
      canDoubleClick,
      isStickyHeaderEnabled,
      handleDoubleClick,
      Data,
      DataColumns,
      setDataColumns,
      externalStyle,
      isFullScreenAllowed,
      canDownloadData,
      canResizeRows,
      ExpandedRowComponent,
      handleExpandedRow,
      canExpandRow,
      handleEdit,
      isCustomRowStyle,
      customRowStyle,
      isRowSelectionAllowed,
      virtualization, 
      sorting
      

    } = props;
  
    // Boolean prop validations
    const booleanProps: { key: string; value: any }[] = [
      { key: "isHiddenColumnsAllowed", value: isHiddenColumnsAllowed },
      { key: "isPaginationAllowed", value: isPaginationAllowed },
      { key: "isScrollAllowed", value: isScrollAllowed },
      { key: "isSearchAllowed", value: isSearchAllowed },
      { key: "canDoubleClick", value: canDoubleClick },
      { key: "isStickyHeaderEnabled", value: isStickyHeaderEnabled },
      { key: "isFullScreenAllowed", value: isFullScreenAllowed },
      { key: "canDownloadData", value: canDownloadData },
      { key: "canResizeRows", value: canResizeRows },
      { key: "canExpandRow", value: canExpandRow },
      { key: "isCustomRowStyle", value: isCustomRowStyle },
      { key: "enableDragandDrop", value: enableDragandDrop },
      { key: "virtualization", value: virtualization },
      { key: "isRowSelectionAllowed", value: isRowSelectionAllowed },
    ];
  
    booleanProps.forEach(({ key, value }) => {
      if (value !== undefined && typeof value !== "boolean") {
        errors.push(`Invalid prop: '${key}' must be a boolean.`);
      }
    });
  
    // Required array props validation
    if (!Array.isArray(Data)) {
      errors.push("Invalid prop: 'Data' must be an array.");
    }
    if (!Array.isArray(DataColumns)) {
      errors.push("Invalid prop: 'DataColumns' must be an array.");
    }
  
    // Required function prop validation
    if (typeof setDataColumns !== "function") {
      errors.push("Invalid prop: 'setDataColumns' must be a function.");
    }
  
    // Optional function props validation
    const functionProps: { key: string; value: any }[] = [
      { key: "handleDoubleClick", value: handleDoubleClick },
      { key: "handleEdit", value: handleEdit },
      { key: "customRowStyle", value: customRowStyle },
    ];
  
    functionProps.forEach(({ key, value }) => {
      if (value !== undefined && typeof value !== "function") {
        errors.push(`Invalid prop: '${key}' must be a function.`);
      }
    });
  
    // Validate externalStyle as an object if provided
    if (externalStyle !== undefined && typeof externalStyle !== "object") {
      errors.push("Invalid prop: 'externalStyle' must be an object.");
    }
  
    // Conditional validation: If `canExpandRow` is true, `ExpandedRowComponent` and `handleExpandedRow` must be provided
    if (canExpandRow) {
      if (!ExpandedRowComponent || typeof ExpandedRowComponent !== "function") {
        errors.push(
          "Invalid prop: 'ExpandedRowComponent' is required and must be a React component when 'canExpandRow' is true."
        );
      }
      if (!handleExpandedRow || typeof handleExpandedRow !== "function") {
        errors.push(
          "Invalid prop: 'handleExpandedRow' is required and must be a function when 'canExpandRow' is true."
        );
      }
    }
  
    // Custom Row Style Validation
    if (isCustomRowStyle) {
      if (!customRowStyle || typeof customRowStyle !== "function") {
        errors.push(
          "Invalid prop: 'customRowStyle' is required and must be a function when 'isCustomRowStyle' is true."
        );
      } else {
        const customRowStyleError = testCustomRowStyle(customRowStyle);
        if (customRowStyleError) {
          errors.push(customRowStyleError);
        }
      }
    }


    if(virtualization){
        if(!isScrollAllowed){
            errors.push("Invalid prop: 'isScrollAllowed' must be true when 'virtualization' is true.");
        }
    }
  
    // Check if any column has `isEditable: true`, then `handleEdit` must be mandatory
    const hasEditableColumn = DataColumns.some((column) => column.isEditable);
    if (hasEditableColumn && (typeof handleEdit !== "function")) {
      errors.push("Invalid prop: 'handleEdit' is required and must be a function when any column has 'isEditable: true'.");
    }
    const hasSorting = DataColumns.some((column) => column.sorting);
    if (hasSorting && !sorting) {
      errors.push("Invalid prop: specify sorting type as single or  multi when sorting is allowed in a column ");
    }
  

    return errors;
  };
  

// Middleware wrapper component
const ValidateAndGenerateTable: React.FC<GenerateTableProps> = (props,  ref: Ref<TextInputRef>) => {

  const errors = validateProps(props);


  if (errors.length > 0) {
    console.error(errors.join("\n"));
    return (
      <div className="alert alert-danger">
        <h5>Validation Errors:</h5>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      
      <GenerateTable {...props} ref={ref} />


   

    </div>
    
  )


};
// @ts-expect-error
export default forwardRef(ValidateAndGenerateTable);

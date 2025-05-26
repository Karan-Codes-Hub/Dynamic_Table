import React, { Suspense } from "react";
import { TableBodyProps } from './types'
import { useState } from "react";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DateFormatUtil from "../../util/DateFormatUtil";
import GenericUtil from "../../util/GenericUtil";
import ThreeDotIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EyeIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';


interface ItemType {
    id?: string | number;
    [key: string]: any; // Allows dynamic keys
}

const TableBody: React.FC<TableBodyProps> = ({
    isPaginationAllowed,
    currentPageData,
    data,
    columns,
    handleTransFormation,
    resizableObject,
    variableSize,
    ExpandedRowComponent,
    handleEdit,
    isCustomRowStyle,
    customRowStyle,
    isRowSelectionAllowed,
    selectedRows,
    handleSingleRowSelectDeselect,
    ArrayColumnRenderer,
    expandedRow,
    eventList,
    isLoading,
    isIndexVisible,
    currentPage,
    itemsPerPage,
    getTableClass,
    handleDisable
}) => {
    const tableData = isPaginationAllowed ? currentPageData : data;

    // const toggleRow = (index: number) => {
    //     setExpandedRow((prevIndex) => (prevIndex === index ? null : index)); // Toggle row expansion
    // };
    const [editingCell, setEditingCell] = useState<any>(null);
    const [statusMessages, setStatusMessages] = useState<{ [key: number]: "success" | "error" | null }>({});

    const handleSave = async (
        item: ItemType,
        editingCell: any,
        newValue: string | number | boolean
    ) => {
        console.log(item, editingCell, newValue, "value");

        let success = true;
        if (handleEdit) {
            await handleEdit(item, editingCell, newValue);
        }
        setStatusMessages((prev) => ({
            ...prev,
            [String(item.id)]: success ? "success" : "error",
        }));

        if (success) {
            item[editingCell.colKey] = newValue as ItemType[keyof ItemType]; // Ensure correct typing
        } else {
            setEditingCell(null);
        }

        setTimeout(() => {
            setStatusMessages((prev) => ({
                ...prev,
                [String(item?.id)]: null,
            }));
        }, 5000); // Remove message after 5 seconds

        return success;
    };
    const EditableCell = ({
        item,
        column,
        editingCell,
        setEditingCell,
        onSave,
        setStatusMessages,
    }: {
        item: any;
        column: any;
        editingCell: { rowId: number; colKey: string, newValue: string } | null;
        setEditingCell: (cell: { rowId?: number; colKey?: string, newValue?: string } | null) => void;
        onSave: (newValue: any) => any;
        setStatusMessages: (messages: { [key: number]: "success" | "error" | null }) => void;
    }) => {
        const isEditing = editingCell?.rowId === item.id && editingCell?.colKey === column.key;
        const [newValue, setNewValue] = useState(item[column.key]);
        const [isHovered, setIsHovered] = useState(false);
        const [isSaving, setIsSaving] = useState(false);

        const handleSave = async () => {
            setIsSaving(true);
            const success = await onSave(newValue);
            console.log(success, "status");

            if (success) {
                setStatusMessages({
                    [Number(item.id)]: "success",
                });
            } else {
                setStatusMessages({
                    [Number(item.id)]: "error",
                });
            }

            setIsSaving(false);
            setEditingCell(null);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditingCell(null);
        };

        return (
            <div
                className={`editable-cell ${isEditing ? "d-flex align-items-center gap-2" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            value={newValue}
                            className="form-control form-control-sm"
                            style={{ width: "120px", padding: "2px 6px", fontSize: "0.875rem" }}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            disabled={isSaving}
                        />

                        {isSaving ? (
                            <span className="spinner-border spinner-border-sm text-primary"></span>
                        ) : (
                            <>
                                <button className="btn btn-success btn-sm ms-2" style={{ padding: "2px 6px" }} onClick={handleSave}>
                                    <SaveIcon fontSize="small" />
                                </button>
                                <button className="btn btn-danger btn-sm ms-1" style={{ padding: "2px 6px" }} onClick={() => setEditingCell(null)}>
                                    <CloseIcon fontSize="small" />
                                </button>
                            </>
                        )}
                        {statusMessages[item.id] === "success" && (
                            <span className="text-success ms-2">Updated</span>
                        )}
                        {statusMessages[item.id] === "error" && (
                            <span className="text-danger ms-2">Error</span>
                        )}
                    </div>
                ) : (
                    <>
                        <span>{item[column.key] ?? ""}</span>
                        {column.isEditable && isHovered && (
                            <BorderColorIcon
                                className="ms-2 text-primary cursor-pointer"
                                fontSize="small"
                                onClick={() => setEditingCell({ rowId: item.id, colKey: column.key })}
                            />
                        )}
                    </>
                )}
            </div>
        );
    };
    const defaultRowStyle = () => "table-row";
    // const handleEditingCellChange = (cell?: { rowId?: number; colKey?: string } | null | undefined) => {
    //     setEditingCell((prev: any) => ({
    //         rowId: cell?.rowId ?? prev?.rowId ?? 0,
    //         colKey: cell?.colKey ?? prev?.colKey ?? "",
    //         newValue: prev?.newValue ?? "",  // Preserve previous value
    //     }));
    // };
    let clickTimer: any = null;
    //go for table clicks only when the click is made on the div
    //not on any button or svg or icon or anything else
    const handleClickEvent = (event: React.MouseEvent, item: any) => {
        const target = event?.target as HTMLElement;

        // Only execute if the click is on a `div`
        if (target?.tagName?.toLowerCase() !== "div") {
            return;
        }

        if (clickTimer) {
            clearTimeout(clickTimer); // Cancel single-click if a double-click is detected
            clickTimer = null;
        }

        if (event.detail === 1) {
            clickTimer = setTimeout(() => {
                eventList["onClick"]?.(item);
                clickTimer = null;
            }, 200); // Delay to check for double-click
        } else if (event.detail === 2) {
            eventList["onDoubleClick"]?.(item);
        } else {
            // Handle any other event
            eventList["onClick"]?.(item);
        }
    };

    return (
        <tbody className={getTableClass('tbody') ?? ''}>
            {isLoading ? (
                // Show Bootstrap Skeleton Loader
                [...Array(Math.min(tableData.length == 0 ? 5 : tableData.length, 5))].map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                        {columns.filter((column) => column.visible).map((column) => (
                            <td key={`skeleton-${index}-${column.key}`} className="text-center p-2">
                                <span className="placeholder placeholder-glow col-6"></span>
                            </td>
                        ))}
                        {isIndexVisible && (
                            <td key={`skeleton-${index}-extra`} className="text-center p-2">
                                <span className="placeholder placeholder-glow col-6"></span>
                            </td>
                        )}
                    </tr>
                ))
            )
                :
                tableData.length > 0 ? (
                    tableData.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr
                                className={(isCustomRowStyle && customRowStyle)
                                    ?
                                    customRowStyle(index, item)
                                    :
                                    (getTableClass('tr') ?

                                        getTableClass('tr')
                                        :
                                        defaultRowStyle())}
                                onClick={(event) => handleClickEvent(event, item)}
                            >

                                {isRowSelectionAllowed && (
                                    <td
                                        className={getTableClass('td') ?
                                            getTableClass('td')
                                            :
                                            "p-2"}>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows?.some((row) => row.id === item.id)}
                                            onChange={() => handleSingleRowSelectDeselect(item!)}
                                            disabled={handleDisable ? handleDisable(item, index, "select_box") : false}
                                        />
                                    </td>
                                )}

                                {isIndexVisible && (
                                    <td className=
                                        {getTableClass('td') ?
                                            getTableClass('td')
                                            :
                                            "p-2 text-center"}
                                        style={{
                                            ...handleTransFormation?.(item, "index"),
                                            height: resizableObject?.[Number(variableSize)]?.height,
                                        }}>
                                        {isPaginationAllowed ? (currentPage - 1) * itemsPerPage + index + 1 : index + 1}
                                        {/* {index + 1} */}
                                    </td>
                                )}

                                {columns.filter((column) => column.visible).map((column) => (
                                    <td
                                        key={column.key}
                                        style={{
                                            ...handleTransFormation?.(item, column.key),
                                            height: resizableObject?.[Number(variableSize)]?.height,
                                        }}
                                        className=
                                        {getTableClass('td') ?
                                            getTableClass('td')
                                            :
                                            ` text-center `}
                                    >
                                        <div>
                                            {(() => {
                                                switch (column.type) {
                                                    case "string":
                                                        return column.isEditable ? (
                                                            <>
                                                                <EditableCell
                                                                    item={item}
                                                                    column={column}
                                                                    editingCell={editingCell}
                                                                    setEditingCell={setEditingCell}
                                                                    onSave={(newValue) => handleSave(item, editingCell, newValue)}
                                                                    setStatusMessages={setStatusMessages}
                                                                />
                                                                {statusMessages[item.id] === "success" && <span className="text-success ms-2">Updated</span>}
                                                                {statusMessages[item.id] === "error" && <span className="text-danger ms-2">Error</span>}
                                                            </>
                                                        ) : (
                                                            <span>{item[column.key] ?? ""}</span>
                                                        );
                                                    case "date":
                                                        return <span>{DateFormatUtil.formatStringDateToAnotherFormat(item[column.key]) ?? ""}</span>;
                                                    case "boolean":
                                                        return <span>{item[column.key] ? "Open" : "Close"}</span>;
                                                    case "number":
                                                        return <span>{item[column.key] ? GenericUtil.formatNumberForCurrency(item[column.key]) :
                                                            (item[column.key] == 0 ? 0 : "-")}</span>;
                                                    case "array":
                                                        return (
                                                            <ArrayColumnRenderer
                                                                key={column.key}
                                                                item={item}
                                                                column={column}
                                                                index={index}
                                                            />
                                                        );
                                                    case "icon": {
                                                        const isDisabled = handleDisable ? handleDisable(item, index, "icon", column) : false;

                                                        return (
                                                            <button
                                                                type="button"
                                                                className={` cursor-pointer p-0 border-0 bg-transparent ${isDisabled ? 'opacity-50' : ''
                                                                    }`}
                                                                onClick={() => !isDisabled && column.action?.(item, column)}
                                                                disabled={isDisabled}
                                                            >
                                                                {column.key === "eye" && <EyeIcon style={{ fontSize: 20 }} aria-label="View" />}
                                                                {column.key === "download" && <DownloadIcon style={{ fontSize: 20 }} aria-label="Download" />}
                                                                {column.key === "delete" && <DeleteIcon style={{ fontSize: 20 }} aria-label="Delete" />}
                                                                {column.key === "threeDotIcon" && <ThreeDotIcon style={{ fontSize: 20 }} aria-label="More Options" />}
                                                                {column.key === "edit" && <EditIcon style={{ fontSize: 20 }} aria-label="Edit" />}

                                                            </button>
                                                        );
                                                    }

                                                    case "button":
                                                        return (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => column.action && column.action(item, column)}
                                                                disabled={handleDisable ? handleDisable(item, index, "button") : false}
                                                            >
                                                                {column.buttonName}
                                                            </button>
                                                        );
                                                    case "component":
                                                        return (
                                                            <div onClick={() => column.action && column.action(item)}>
                                                                {typeof item[column.key]?.displayData === "function"
                                                                    ? item[column.key].displayData(item)
                                                                    : item[column.key]?.displayData}
                                                            </div>
                                                        );
                                                    default:
                                                        return <span>{item[column.key] ?? ""}</span>;
                                                }
                                            })()}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            {/* Expanded Row Section */}

                            {expandedRow === item.id && (
                                <tr className="expanded-row">
                                    <td colSpan={
                                        columns.filter(col => col.visible).length +
                                        (isRowSelectionAllowed ? 1 : 0) +
                                        (isIndexVisible ? 1 : 0)
                                    } className="p-0 bg-light">
                                        <div className="w-100 d-flex flex-column align-items-center ">
                                            <Suspense
                                                fallback={
                                                    <div className="d-flex justify-content-center align-items-center py-3">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                {ExpandedRowComponent ? (
                                                    <ExpandedRowComponent item={item} columns={columns} />
                                                ) : (
                                                    <div className="d-flex justify-content-center align-items-center py-3">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Suspense>
                                        </div>
                                    </td>
                                </tr>
                            )}

                        </React.Fragment>
                    ))
                ) : (
                    <tr
                        className={getTableClass('tr') ?? ''}
                    >
                        <td colSpan={columns.filter((column) => column.visible).length}
                            className=
                            {getTableClass('td') ?
                                getTableClass('td')
                                :
                                "text-center p-2"}>
                            No data available
                        </td>
                    </tr>
                )}
        </tbody>


    );
};

export default TableBody;

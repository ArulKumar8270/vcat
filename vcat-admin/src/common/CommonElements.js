import React from "react";
import { Dropdown } from "primereact/dropdown";
import { filterDropdownList } from "./CommonDropdownOptions";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";

export const TableGlobalSearch = ({ value, onChange }) => <span className="p-input-icon-right">
    <i className="pi pi-search mr-2" style={{ color: "#464eb8" }} />
    <InputText
        value={value}
        className='rounded-pill border-0'
        style={{ backgroundColor: '#0000000d' }}
        placeholder="Type to search"
        onChange={({ target: { value } }) => {
            if (onChange)
                onChange(value);
        }}
    />
</span>
export const TableTabs = ({
    value,
    latestLabel = "Latest",
    latestValue = "Latest",
    archiveLabel = "Archive",
    archiveValue = "Archive",
    onChange }) => <SelectButton
        value={value}
        options={[{ label: latestLabel, value: latestValue }, { label: archiveLabel, value: archiveValue }]}
        onChange={({ value }) => {
            if (value && onChange)
                onChange(value);
        }} />
export const TableFilterDropdown = ({ value, onChange }) => <Dropdown
    optionLabel="label"
    optionValue="value"
    value={value}
    options={filterDropdownList}
    onChange={onChange}
    placeholder="Filter"
    className="rounded-pill pl-2 pr-2 filter-dropdown"
    dropdownIcon="pi pi-chevron-down primary-color text-white rounded-circle p-1"
/>
export const CommonTable = ({
    value,
    loading,
    children,
    exportExcel,
    dataKey = "id",
    globalFilterFields,
    globalFilter,
}) => {
    return <div style={{ overflow: "scroll" }}>
        <DataTable
            value={value}
            size="small"
            autoLayout
            loading={loading}
            paginator
            dataKey={dataKey}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            rows={10}
            width="100%"
            responsiveLayout="scroll"
            scrollable
            // scrollHeight="460px"
            scrollHeight="flex"
            // scrollDirection="both"
            rowHover
            filterDisplay="menu"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            emptyMessage="No rows"
            columnResizeMode="fit"
            resizableColumns
            globalFilterFields={globalFilterFields}
            filters={globalFilter ? {
                'global': { value: globalFilter, matchMode: FilterMatchMode.CONTAINS }
            } : null}
            paginatorLeft={exportExcel ? <Button
                onClick={exportExcel}
                className="p-button-text mr-1 text-white primary-color"
                icon="pi pi-download"
                tooltip="Export Excel"
            /> : null}
        >
            {children}
        </DataTable>
    </div>;
}
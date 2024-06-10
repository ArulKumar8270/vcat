import React, { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io"
import Select from 'react-select';
import { IoAddCircleOutline } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { observer } from "mobx-react";

function DynamicInput() {
    const [fields, setFields] = useState([]);

    // function handleChange(i, event) {
    //     const values = [...fields];
    //     values[i].value = event.target.value;
    //     setFields(values);
    // }

    function handleAdd() {
        const values = [...fields];
        values.push({ value: null });
        setFields(values);
    }

    function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
    }

    return (
        <div className="App">
            <button type="button" className="btn upload-doc-div event-cta mb-4" style={{ width: "100%" }}
                onClick={() => handleAdd()}>
                Add Member <IoAddCircleOutline style={{ width: "1.2rem", height: "1.2rem", marginLeft: "0.5rem" }} />
            </button>
            {fields.length > 0 ?
                fields.map((field, idx) => {
                    return (
                        <div key={`${field}-${idx}`}>
                            {/* <input
                                type="text"
                                placeholder="Enter text"
                                value={field.value || ""}
                                onChange={e => handleChange(idx, e)}
                            /> */}

                            <div className='upload-doc-div mb-4'>
                                <div className="mb-3">
                                    <label>Role <IoIosArrowDropdownCircle className="ml-1" /></label>
                                    <Select
                                        aria-label="Default select example"
                                        placeholder="Select Role Status"
                                        type="drop"
                                        closeMenuOnSelect={true}
                                        // components={animatedComponents}
                                        // onChange={this.onRoleTitle}
                                        // options={RoleList}
                                        // isMulti
                                        isClearable
                                    />
                                    {/* <div className="d-flex justify-content-start">
                                                {this.state.RoleNameError ? (<span className='small-font-size text-danger'> {this.state.RoleNameError}</span>) : ''}
                                            </div> */}
                                </div>
                            </div>
                            <div className='upload-doc-div mb-4'>
                                <div className="mb-3 select">
                                    <label >Member <IoIosArrowDropdownCircle className="ml-1" /></label>
                                    <Select
                                        aria-label="Default select example"
                                        placeholder="Select the Member"
                                        type="drop"
                                        // value={this.state.selectPerm}
                                        // onChange={this.onSelectPerm}
                                        closeMenuOnSelect={false}
                                        // components={animatedComponents}
                                        isMulti
                                    // options={PermissionList}
                                    />
                                </div>

                                {/* <div className="d-flex justify-content-start">
                                            {this.state.selectMemberError ? (<span className='small-font-size text-danger'> {this.state.selectMemberError}</span>) : ''}
                                        </div> */}

                            </div>
                            <button type="button" className="btn event-cta-trans" style={{ width: "100%" }} onClick={() => handleRemove(idx)}>
                                Delete Member <TiDelete style={{ width: "1.2rem", height: "1.2rem", marginLeft: "0.5rem" }} />
                            </button>
                        </div>
                    );
                })
                : null
            }
        </div>
    );
}

export default observer(DynamicInput)

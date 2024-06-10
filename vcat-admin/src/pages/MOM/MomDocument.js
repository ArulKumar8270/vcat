import { momAutoPopulate, wingsDropdown } from '../../libraries/momDashboard';
import { getUsersDropdown } from '../../libraries/dashboard';
import moment from 'moment';
import { jsPDF } from 'jspdf';

const getWingsDropdown = async () => {
    const response = await wingsDropdown();
    const { status, result: _wingOption } = response;
    if (status === "success" && _wingOption) {
        return (Array.isArray(_wingOption) ? _wingOption : []);
    }
    return [];
};

const getMemberDropdown = async () => {
    const response = await getUsersDropdown();
    const { status, result: _memberOption } = response;
    if (status === "success" && _memberOption) {
        return (Array.isArray(_memberOption) ? _memberOption : []);
    }
    return [];
};

const textCapitalize = (text = "") => {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
};

const textFormatCapitalize = (text = "") => {
    return textCapitalize(text.split("_").join(" "));
};

const getData = async (id) => {
    if (id !== null) {
        const memberOption = await getMemberDropdown();
        const wingOption = await getWingsDropdown();

        const formModel = {};
        const response = await momAutoPopulate(id);
        if (response) {
            const { status, result } = response;
            if (status === 'success' && result) {
                const { moms } = result;
                if (moms) {
                    const {
                        members,
                        wings,
                        members_present,
                        co_opted_bot,
                        icai_membership_no,
                        year,
                        continuous,
                        meeting_number,
                        city,
                        date_time,
                        meeting_type,
                        event_type,
                        venue,
                        invocation,
                        welcome_address,
                        content,
                        id,
                    } = moms;

                    formModel.id = String(id);
                    formModel.membershipNo = icai_membership_no ? String(icai_membership_no) : "-";
                    formModel.year = year ? String(year) : "-";
                    formModel.continuous = continuous ? String(continuous) : "-";
                    formModel.meetingNo = meeting_number ? String(meeting_number) : "-";
                    formModel.city = city ? String(city) : "-";
                    formModel.dateTime = date_time ? moment(result?.date_time).format("DD-MMM-YY  hh:mm A") : "-";
                    formModel.date = date_time ? moment(result?.date_time).format("DD/MM/YYYY") : "-";
                    formModel.time = date_time ? moment(result?.date_time).format("hh:mm A") : "-";
                    formModel.meetingType = meeting_type ? textFormatCapitalize(String(meeting_type)) : "-";
                    formModel.eventType = event_type ? textCapitalize(String(event_type)) : "-";
                    formModel.venue = venue ? String(venue) : "-";
                    formModel.invocation = invocation ? String(invocation) : "-";
                    formModel.welcomeAddress = welcome_address ? String(welcome_address) : "-";
                    formModel.description = content ? String(content) : "-";
                    // if (content) {
                    //     const tempElement = document.getElementById("temp_for_html_to_string");
                    //     tempElement.innerHTML = content;
                    //     formModel.description = tempElement.innerText;
                    // } else formModel.description = "-";

                    let selectedMembers = [];
                    if (members && Object.keys(members).length > 0) {
                        const users = JSON.parse(members);
                        if (Array.isArray(users) && users.length > 0)
                            selectedMembers = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
                    }

                    formModel.members = selectedMembers;

                    let selectedWings = [];
                    if (wings && Object.keys(wings).length > 0) {
                        const users = JSON.parse(wings);
                        if (Array.isArray(users) && users.length > 0)
                            selectedWings = wingOption?.filter(({ value: wing_id }) => users?.includes(wing_id));
                    }

                    formModel.wings = selectedWings;

                    let membersAttended = [];
                    if (members && Object.keys(members).length > 0) {
                        const users = JSON.parse(members_present);
                        if (Array.isArray(users) && users.length > 0)
                            membersAttended = memberOption?.filter(({ value: user_id }) => users?.includes(user_id));
                    }

                    formModel.membersAttended = membersAttended;

                    const membersInvited = [];
                    if (Array.isArray(selectedWings) && selectedWings.length > 0) {
                        selectedWings.forEach(({ members: wingMembers }) => {
                            if (Array.isArray(wingMembers) && wingMembers.length > 0) {
                                memberOption?.filter(({ value: user_id }) => wingMembers?.includes(user_id)).forEach((wingMember) => {
                                    if (!membersInvited.includes(wingMember)) membersInvited.push(wingMember);
                                });
                            }
                        });
                    }
                    if (Array.isArray(selectedMembers) && selectedMembers.length > 0) {
                        selectedMembers?.forEach((selectedMember) => {
                            if (!membersInvited?.includes(selectedMember))
                                membersInvited?.push(selectedMember);
                        });
                    }

                    const membersAbsent = membersInvited.filter((invitedMember) => membersAttended.includes(membersInvited) === false);
                    formModel.membersAbsent = membersAbsent;

                    const coOptedBotsOptions = memberOption.filter((coOptedBotMember) => membersInvited.includes(coOptedBotMember) === false);
                    let coOptedBots = [];
                    if (co_opted_bot && Object.keys(co_opted_bot).length > 0) {
                        const users = JSON.parse(co_opted_bot);
                        if (Array.isArray(users) && users.length > 0)
                            coOptedBots = coOptedBotsOptions?.filter(({ value: user_id }) => users?.includes(user_id));
                    }

                    formModel.coOptedBots = coOptedBots;
                }
            }
        }
        return formModel;
    }
    return null;
};

const spaceChar = "&nbsp;";
const paraStart = `<span style="font-family: sans-serif;">`;
const paraEnd = "</span>";

const textFormatter = (text = "") => {
    const newText = String(text).split(" ").filter((char) => char !== "").join(" ");
    return `${paraStart}${newText}${paraEnd}`;
};

// const fieldSeparator = textFormatter(":");

const getMemberCol = (member, i) => {
    const { label } = member;
    let newLabel = String(label);

    newLabel = newLabel.trimEnd();
    newLabel = `${newLabel.substring(0, 1).toUpperCase()}${newLabel.substring(1)}`;
    newLabel = newLabel.split(" ").filter((str) => str !== "").join(spaceChar);
    const text = textFormatter(`${Number(i) + 1}. ${newLabel}`);

    return `<div class="col d-flex">${text}</div>`;
};

const getMembersDiv = (members) => {
    let div = "";
    if (Array.isArray(members) && members.length > 0) {
        let innerDiv = "";
        members?.forEach((member, index) => innerDiv += getMemberCol(member, index));
        if (innerDiv.length > 0)
            div = `<div class="col d-flex flex-column mx-3">${innerDiv}</div>`;
    }
    return div;
};

export const downloadMomPdf = async (id) => {
    const momData = await getData(id);
    if (momData) {
        // const headerHtml = `<div class="col d-flex">
        //         <div class="col-3">
        //             <img src="${window.location.origin}/static/media/logo.4b9cd17cab3eaca2c63e.png" alt="" class="img-fluid">
        //         </div>
        //         <div class="col p-0 m-0 h5 font-weight-bold text-center d-flex flex-column align-items-center justify-content-center">
        //             <div class="col-auto p-0 m-0 p-1">${textFormatter("SRI VASAVI CA CHARITABLE")}</div>
        //             <div class="col-auto p-0 m-0 p-1">${textFormatter("TRUST (VCAT)")}</div>
        //         </div>
        //     </div>
        //     <div class="col">
        //         <hr>
        //     </div>`,
        //     momReportHtml = `<div class="col-auto d-flex h6 font-weight-bold align-items-center">
        //             <u>
        //                 ${textFormatter("MOM Report")}
        //             </u>
        //         </div>
        //         <div class="col p-1">
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Year")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.year)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Continuous Meeting")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.continuous)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Meeting Number")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.meetingNo)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("City")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.city)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Date")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.dateTime)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Meeting Type")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.meetingType)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Event Type")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.eventType)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Venue")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.venue)}
        //             </div>
        //         </div>
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Invocation")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //                 ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${textFormatter(momData?.invocation)}
        //             </div>
        //         </div>
        //         <div class="col d-flex p${momData?.membersAttended?.length === 0 ? "y" : "t"}-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Members Present")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //             ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${momData?.membersAttended?.length === 0 ? "-" : ""}
        //             </div>
        //         </div>
        //         ${getMembersDiv(momData?.membersAttended)}
        //         <div class="col d-flex p${momData?.membersAbsent?.length === 0 ? "y" : "t"}-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Members Absent")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //             ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${momData?.membersAbsent?.length === 0 ? "-" : ""}
        //             </div>
        //         </div>
        //         ${getMembersDiv(momData?.membersAbsent)}
        //         <div class="col d-flex p${momData?.coOptedBots?.length === 0 ? "y" : "t"}-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Co-opted Bot")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //             ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${momData?.coOptedBots?.length === 0 ? "-" : ""}
        //             </div>
        //         </div>
        //         ${getMembersDiv(momData?.coOptedBots)}
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Welcome address by the President")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //             ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${momData?.welcomeAddress ? "" : "-"}
        //             </div>
        //         </div>
        //         ${momData?.welcomeAddress ? '<div class="col py-2 ml-3">' + textFormatter(momData?.welcomeAddress) + '</div>' : ""}
        //         <div class="col d-flex py-2">
        //             <div class="col-5 justify-content-start text-justify d-flex font-weight-bold">
        //                 ${textFormatter("Meeting Brief")}
        //             </div>
        //             <div class="col-auto d-flex font-weight-bold align-items-center">
        //             ${fieldSeparator}
        //             </div>
        //             <div class="col d-flex">
        //                 ${momData?.description ? "" : "-"}
        //             </div>
        //         </div>
        //         ${momData?.description ? '<div class="col py-2 ml-3">' + textFormatter(momData?.description) + '</div>' : ""}`;
        const momDescriptionHtml = `
                <div class="col-auto d-flex align-items-center">
                ` + textFormatter(`Minutes of Meeting of the Board of Trustees of Sri Vasavi CA Charitable Trust for the term - ${momData?.year} held at ${momData?.venue} on ${momData?.date} at ${momData?.time}`)
            + `</div>`,
            memberPresentHtml = `
                <div class="p${momData?.membersAttended?.length === 0 ? "y" : "t"}-2 col-auto d-flex justify-content-start align-items-center text-justify font-weight-bold my-2">
                    `+ textFormatter(`Members Present: ${momData?.membersAttended?.length === 0 ? "-" : ""}`) + `
                </div>
                ${getMembersDiv(momData?.membersAttended)}`,
            leaveOfAbsenceHtml = `
                <div class="p${momData?.membersAbsent?.length === 0 ? "y" : "t"}-2 col-auto d-flex justify-content-start align-items-center text-justify font-weight-bold my-2">
                    `+ textFormatter(`Leave of Absence: ${momData?.membersAbsent?.length === 0 ? "-" : ""}`) + `
                </div>
                ${getMembersDiv(momData?.membersAbsent)}`,
            invocationHtml = `
                <div class="col-auto d-flex justify-content-start align-items-center text-justify font-weight-bold my-2">
                    ${textFormatter("1. Invocation")}
                </div>
                <div class="col-auto d-flex justify-content-start align-items-center text-justify my-2">
                    ${textFormatter(momData?.invocation)}
                </div>`,
            welcomeAddressHtml = `
                <div class="col-auto d-flex justify-content-start align-items-center text-justify font-weight-bold my-2">
                    ${textFormatter("2. Welcome address by the President")}
                </div>            
                ${momData?.welcomeAddress ? '<div class="col py-2 ml-3 my-2">' + textFormatter(momData?.welcomeAddress) + '</div>' : "-"}`,
            htmlContent = `<div class="d-flex flex-column px-1" style="width: 566px;">
                    ${momDescriptionHtml}
                    ${memberPresentHtml}
                    ${leaveOfAbsenceHtml}
                    ${invocationHtml}
                    ${welcomeAddressHtml}
                </div>`;

        var doc = new jsPDF({
            orientation: 'portrait',
            format: 'a4',
            unit: 'pt',
        });
        // doc.page = 1; // use this as a counter.
        // doc.text(150, 285, 'page ' + doc.page); //print number bottom right
        // doc.page++;
        const logoElement = document.getElementById('VCAT-Logo');
        doc.setFont("sans-serif");
        doc.setTextColor("#000000");
        const topMargin = 150,
            bottomMargin = 30,
            horizontalMargin = 15,
            imageSize = 75;
        doc.html(htmlContent, {
            // margin: 15,
            margin: [topMargin, horizontalMargin, bottomMargin, horizontalMargin],
            autoPaging: "text",
            callback: (pdfDoc) => {
                const numberOfPages = pdfDoc.getNumberOfPages();
                pdfDoc.setFont("sans-serif", 'bold');
                pdfDoc.setFontSize(22);
                for (let index = 0; index < numberOfPages; index++) {
                    const pageIndex = index + 1;
                    pdfDoc.setPage(pageIndex);
                    doc.setDrawColor("#4472c4");
                    pdfDoc.rect(20, 20, pdfDoc.internal.pageSize.width - 40, pdfDoc.internal.pageSize.height - 40, 'S');
                    pdfDoc.addImage(logoElement, 50, 30, imageSize, imageSize);
                    pdfDoc.text(' Sri Vasavi CA Charitable Trust', 170, 70);
                }
                return pdfDoc.save(`VCAT MOM ${momData?.dateTime || ""}.pdf`, { returnPromise: true });
            },
        });
    }
};

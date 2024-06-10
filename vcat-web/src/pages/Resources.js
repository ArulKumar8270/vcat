// import React, { Component } from 'react'
// import { BsBoxArrowUpRight } from "react-icons/bs";
// import { callApi } from '../libraries/Api';
// import { GrDocumentText } from "react-icons/gr";

// class Resources extends React.Component {

//     state = {
//         bannerData: [],
//         resourcesData: [],
//         size: 50,
//         filter: 'morethan_one_year',
//         search: '',
//         current_page: 1,

//     }

//     componentDidMount() {
//         const functionUrl = 'pages';
//         const requestBody = {
//             page: 'resources'
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             if (response.status === "success") {
//                 const result = response.result;
//                 this.setState({

//                     bannerData: result.bannerData[0],
//                     // resourcesData: result.resources
//                 });
//             }
//         });
//         // call API
//         this.resources();
//     }
//     resources() {
//         const functionUrl = 'resource';
//         const requestBody = {
//             search: this.state.search,
//             size: 50,
//             filter: 'morethan_one_year',
//             current_page: 1,
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             if (response.status === "success") {
//                 const result = response.result;
//                 const archive = result?.archieveResources;
//                 const latest = result?.latestResources;
//                     console.log("archive",archive)
//                     const resourcesData = [];
//                 for(let i in archive?.data) {
//                     resourcesData.push(archive?.data[i])
//                     console.log("archive",resourcesData)
//                 }
//                 for(let i in latest?.data) {
//                     resourcesData.push(latest?.data[i]);
//                     console.log("latest",resourcesData)
//                 }
//                 this.setState({
//                     resourcesData
//                     // bannerData: result.bannerData[0],
//                     // resourcesData: result.resources
//                 });
//             }
//         });
//     }
//     callApiSearch = (e) => {
//         const { value } = e.target;
//         this.setState({ rows: [], current_page: 1, search: value });
//         this.resources();
//     };

//     render() {
//         const searchActive = 'active';
//         const { bannerData, resourcesData } = this.state;
//         const truncate = (input) =>
//         input?.length > 100 ? `${input.substring(0, 90)}...` : input;
//         return (
//             <div>
//                 {/* <!-- section1: navbar, hero carousel --> */}
//                 <section className='mg-top'>
//                     <div className="sub-herosection event-page ev-bg" style={{ backgroundImage: "url(" + bannerData.image + ")" }}>
//                         <div className="container-wrapper">
//                             <div className="overlay boxShadow ">
//                                 <div className="carl-caption text-start">
//                                     <h1>{bannerData.title}</h1>
//                                     <p dangerouslySetInnerHTML={{ __html: bannerData.content === null || bannerData.content === "" ? "No Content" : bannerData.content }}>
//                                         </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 {/* <!-- section2 --> */}
//                 <section className="eventSection upev-bg tableheight textCap">
//                     <div className="container-wrapper">
//                         <div className="row">
//                             <h2 className="mb-5 mt-3">STUDENT SESSION PRESENTATION MATERIALS</h2>
//                             <div className="container">
//                                 <div className="table-responsive">
//                                     <div className={`search-wrapper dashboard-search d-flex justify-content-end pr-2 ${searchActive}`}>
//                                                  <div className="input-holder" style={{marginRight:10}} >
//                                                     <input type="text" className="search-input" placeholder="Type to search"
//                                                         onChange={this.callApiSearch} value={this.state.search}
//                                                     />
//                                                     <button className="search-icon" type='btn'
//                                                 ><span></span></button>
//                                         </div>

//                                     </div>
//                                     <div style={{height:'50rem',overflow:'auto'}}>
//                                     <table className="table table-striped table-hover boxShadow bg-white">
//                                         <thead className="table-orgn table-pdf">

//                                             <tr>
//                                                 <th scope="col"></th>
//                                                 <th scope="col"></th>
//                                                 <th scope="col">Subject</th>
//                                                 <th scope="col">Topic</th>
//                                                 <th scope="col">Link</th><th scope="col"></th>
//                                                 <th scope="col">Documents</th>
//                                                 <th scope="col">Speaker</th>
//                                                 <th scope="col">Presentation Material</th>
//                                             </tr>
//                                         </thead>
//                                         {/* height: 50rem;overflow: auto; */}
//                                         <tbody>
//                                                 {resourcesData.map((resource, i) => {
//                                                      const str = "https://stackoverflow.com/questions/56698453/express-session-cannot-set-property-user-of-undefined";
//                                                      var sliced = str.slice(0, 70);
//                                                     const truncDes = truncate("https://stackoverflow.com/questions/56698453/express-session-cannot-set-property-user-of-undefined");
//                                                 return (
//                                                     <tr key={i}>
//                                                         <td></td>
//                                                         <td>{i+1}</td>
//                                                         <td>{resource.subject === ""|| resource.subject=== null?"No Subject":resource.subject}</td>
//                                                         <td>{resource.topic === ""|| resource.topic=== null?"No topic":resource.topic}</td>
//                                                         <td>
//                                                             <a href={resource.link} target="_blank" rel="noreferrer">{resource.link === "" || resource.link === null ? "No Link" : <>
//                                                             <a>Link <BsBoxArrowUpRight className='redirect'/></a></>}</a></td>   <td></td>
//                                                         <td><a href={resource.document} target="_blank" rel="noreferrer" ><GrDocumentText style={{width:'1.5rem',height:'1.5rem'}}/></a></td>
//                                                         <td>{resource?.speaker === ""|| resource.speaker=== null?"No speaker":resource.speaker}</td>
//                                                         <td><a href={resource.document} download target="_blank" rel="noreferrer"  className="btn btn-lg btn-primary">Download</a></td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                         </tbody>
//                                     </table>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         );
//     }
// }

// export default Resources

import React from "react";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { callApi } from "../libraries/Api";
import { GrDocumentText, GrDown } from "react-icons/gr";
import "../components/css/pagestyle.css";

class Resources extends React.Component {
  state = {
    bannerData: [],
    resourcesData: [],
    resourcesDataOriginal: [],
    linksData: [],
    size: 100,
    filter: "more than one year",
    search: "",
    current_page: 1,
  };

  componentDidMount() {
    const functionUrl = "pages";
    const requestBody = {
      page: "resources",
    };
    callApi(functionUrl, requestBody).then((response) => {
      if (response.status === "success") {
        const result = response.result;
        this.setState({
          bannerData: result.bannerData[0],
          // resourcesData: result.resources
        });
      }
    });
    // call API
    this.resources();
  }
  resources() {
    const functionUrl = "resources";
    callApi(functionUrl, {}, "GET").then((response) => {
      if (response.status === "success") {
        const result = response.result;
        this.setState({
          resourcesData: [...result],
          resourcesDataOriginal: [...result],
          linksData: [
            // ["https://www.icai.org/"],
            // ["https://www.incometaxindia.gov.in/"],
            // ["https://www.mca.gov.in/content/mca/global/en/home.html"],
            // ["https://www.ibef.org/"],
            // ["https://www.ipindiaonline.gov.in/"],
            // ["http://www.startupinida.gov.in/"],
            // ["https://www.udyamregistration.gov.in/"],
            ["www.icai.org/"],
            ["www.incometaxindia.gov.in/"],
            ["www.mca.gov.in/content/mca/global/en/home.html"],
            ["www.ibef.org/"],
            ["www.ipindiaonline.gov.in/"],
            ["www.startupinida.gov.in/"],
            ["www.udyamregistration.gov.in/"],
          ],
          // bannerData: result.bannerData[0],
        });
      }
    });
  }
  // resources() {
  //   const functionUrl = "resource";
  //   const requestBody = {
  //     search: this.state.search,
  //     size: 100,
  //     filter: "more than one year",
  //     current_page: 1,
  //   };
  //   callApi(functionUrl, requestBody).then((response) => {
  //     if (response.status === "success") {
  //       const result = response.result;
  //       const archive = result?.archieveResources;
  //       const latest = result?.latestResources;
  //       console.log("archive", archive);
  //       const resourcesData = [];
  //       for (let i in archive?.data) {
  //         resourcesData.push(archive?.data[i]);
  //         console.log("archive", resourcesData);
  //       }
  //       for (let i in latest?.data) {
  //         resourcesData.push(latest?.data[i]);
  //         console.log("latest", resourcesData);
  //       }
  //       this.setState({
  //         resourcesData,
  //         linksData: [
  //           [" www.icai.org"],
  //           ["www.incometaxindia.gov.in"],
  //           ["www.mca.gov.in"],
  //           ["www.ibef.org"],
  //           ["www.ipindiaonline.gov.in"],
  //           ["www.startupinida.gov.in"],
  //           ["www.udyamregistration.gov.in"],
  //         ],
  //         // bannerData: result.bannerData[0],
  //       });
  //     }
  //   });
  // }
  subjectBasedFilter = () => {};
  topicBasedFilter = () => {};
  speakerBasedFilter = () => {};

  callApiSearch = (e) => {
    // const { value } = e.target;
    // this.setState({ rows: [], current_page: 1, search: value });
    // this.resources();
    const { value } = e.target;
    this.setState({ search: value }, () => {
      const { resourcesDataOriginal } = this.state;
      let arr = [];
      if (resourcesDataOriginal && resourcesDataOriginal.length > 0) {
        for (const [i, resourceData] of resourcesDataOriginal.entries()) {
          const { subject = "", topic = "", speaker = "" } = resourceData;
          const subjectLowercased = subject.toLowerCase();
          const topicLowercased = topic.toLowerCase();
          const speakerLowercased = speaker.toLowerCase();
          const valueLowercased = value.toLowerCase();
          if (
            subjectLowercased.includes(valueLowercased) ||
            topicLowercased.includes(valueLowercased) ||
            speakerLowercased.includes(valueLowercased)
          ) {
            arr.push({ ...resourceData });
          }
        }
      }
      this.setState({ resourcesData: [...arr] });
      arr = [];
    });
  };

  render() {
    const searchActive = "active";
    const { bannerData, resourcesData, linksData } = this.state;
    return (
      <div>
        {/* <!-- section1: navbar, hero carousel --> */}
        <section className="mg-top">
          <div
            className="sub-herosection event-page ev-bg"
            style={{ backgroundImage: "url(" + bannerData.image + ")" }}
          >
            <div className="container-wrapper">
              <div className="overlay boxShadow ">
                <div className="carl-caption text-start">
                  <h1>{bannerData.title}</h1>
                  {/* <p dangerouslySetInnerHTML={{ __html: bannerData.content === null || bannerData.content === "" ? "No Content" : bannerData.content }}>
                                    </p> */}

                  <p>
                    <strong className="mb-1"> Members</strong>
                  </p>
                  <p>
                    VCAT conducts technical sessions on varied topics for
                    members and the resource materials can be accessed by Life
                    Members and Life Trustees after logging in.
                    <a
                      href="https://admin.vcat.co.in/"
                      style={{ color: "#fff", textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      Login Now
                      <BsBoxArrowUpRight
                        className="redirect"
                        style={{
                          color: "#fff",
                          width: "1.2rem",
                          height: "1.2rem",
                        }}
                      />
                    </a>
                  </p>
                  <p>
                    <strong className="mb-1">Students</strong>
                  </p>
                  <p>
                    {" "}
                    VCAT conducts periodic study and coaching sessions for the
                    benefit of the student community. Practicing CAs with expert
                    knowledge in the domain carefully prepare study/coaching
                    material for these sessions. Many students have greatly
                    benefited from these sessions. In this section students can
                    download free study and discussion material prepared by
                    professionals.
                    <a
                      href="#resources"
                      className="whiteSvg"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      {" "}
                      Scroll Down
                      <GrDown style={{ fill: "#fff" }} />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- section2 --> */}
        <section className="eventSection upev-bg tableheight textCap">
          <div className="container-wrapper">
            <div className="row" id="resources">
              <h2 className="mb-5 mt-3">
                STUDENT SESSION PRESENTATION MATERIALS
              </h2>
              <div className="container">
                <div className="table-responsive">
                  <div
                    className={`search-wrapper dashboard-search d-flex justify-content-end pr-2 ${searchActive}`}
                  >
                    <div className="input-holder" style={{ marginRight: 10 }}>
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Type to search"
                        onChange={this.callApiSearch}
                        value={this.state.search}
                        id="resourcesTypeToSearch"
                      />
                      <button className="search-icon" type="btn">
                        <span></span>
                      </button>
                    </div>
                  </div>
                  <div style={{ height: "50rem", overflow: "auto" }}>
                    <table className="table table-striped table-hover boxShadow bg-white">
                      <thead className="table-orgn table-pdf">
                        <tr>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">Subject</th>
                          <th scope="col">Topic</th>
                          <th scope="col">Link</th>
                          <th scope="col"></th>
                          <th scope="col">Documents</th>
                          <th scope="col">Speaker</th>
                          <th scope="col">Presentation Material</th>
                        </tr>
                      </thead>
                      {/* height: 50rem;overflow: auto; */}
                      <tbody>
                        {resourcesData.map((resource, i) => {
                          return (
                            <tr key={i}>
                              <td></td>
                              <td>{i + 1}</td>
                              <td>
                                {resource.subject === "" ||
                                resource.subject === null
                                  ? "No Subject"
                                  : resource.subject}
                              </td>
                              <td>
                                {resource.topic === "" ||
                                resource.topic === null
                                  ? "No topic"
                                  : resource.topic}
                              </td>
                              <td>
                                <a
                                  href={`https:\\${resource.link}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ textDecoration: "none" }}
                                >
                                  {resource.link === "" ||
                                  resource.link === null ? (
                                    "---"
                                  ) : (
                                    <>
                                      <a href={resource.link}>
                                        Link{" "}
                                        <BsBoxArrowUpRight className="redirect" />
                                      </a>
                                    </>
                                  )}
                                </a>
                              </td>
                              <td>&nbsp;</td>
                              <td>
                                <a
                                  href={resource.document}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <GrDocumentText
                                    style={{
                                      width: "1.5rem",
                                      height: "1.5rem",
                                    }}
                                  />
                                </a>
                              </td>
                              <td>
                                {resource?.speaker === "" ||
                                resource.speaker === null
                                  ? "No speaker"
                                  : resource.speaker}
                              </td>
                              <td>
                                <a
                                  href={resource.document}
                                  download
                                  className="btn btn-lg btn-primary"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="eventSection upev-bg tableheight textCap">
          <div className="container-wrapper">
            <div className="row">
              <h2 className="mb-5 mt-3">Important Links</h2>
              <div className="container">
                <div className="table-responsive">
                  <div style={{ height: "20rem", overflow: "auto" }}>
                    <table className="table table-striped table-hover boxShadow bg-white">
                      <thead className="table-orgn table-pdf">
                        <tr>
                          <th scope="col"></th>
                          <th scope="col"></th>
                          <th scope="col">Links</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {linksData.map((link, i) => {
                          return (
                            <tr key={i}>
                              <td></td>
                              <td>{i + 1}</td>
                              <td className="p-3">{link}</td>
                              <td>
                                <a
                                  href={`https://${link}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-lg btn-primary"
                                >
                                  visit{" "}
                                  <BsBoxArrowUpRight className="redirect" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Resources;

// import React, { Component } from "react";
// import { callApi } from "../libraries/Api";
// import { Link } from "react-router-dom";

// class Connect extends Component {
//   state = {
//     bannerData: [],
//     pageInfo: [],
//     connectParaSpan: "",
//   };

//   componentDidMount() {
//     const functionUrl = "pages";
//     const requestBody = {
//       page: "connect",
//     };
//     callApi(functionUrl, requestBody).then((response) => {
//       if (response.status === "success") {
//         const result = response.result;
//         this.setState({
//           bannerData: result.bannerData[0],
//           pageInfo: result.pageInfo[0],
//         });
//       }
//     });
//     // call API
//     this.setState({
//       connectParaSpan:
//         "The purpose of the meet was to develop fellowship among CA’s of Bangalore. It was attended by seniors, middle aged and the newly qualified CA’s. The outcome was very encouraging whereby the casual meet on a usual Sunday became an extra ordinary Sunday which enabled formation of your Charitable Trust.",
//     });
//   }

//   render() {
//     const { bannerData, pageInfo, connectParaSpan } = this.state;
//     return (
//       <div className="">
//         {/* <!-- section1: navbar, hero carousel --> */}
//         <section className="mg-top">
//           <div
//             className="sub-herosection connect-page abouthero-bg"
//             style={{ backgroundImage: "url(" + bannerData.image + ")" }}
//           >
//             <div className="container-wrapper ">
//               <div className="overlay boxShadow">
//                 <div className="carl-caption text-start">
//                   <h1>{bannerData.title}</h1>
//                   <p
//                     dangerouslySetInnerHTML={{
//                       __html:
//                         bannerData.content === null || bannerData.content === ""
//                           ? "No Content"
//                           : bannerData.content,
//                     }}
//                   ></p>
//                   <Link
//                     className="btn btn-lg btn-primary boxShadow"
//                     to="/admin2/"
//                   >
//                     {" "}
//                     VCAT CONNECT
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* <!-- section2: About Us --> */}
//         <section
//           className="aboutSection sectionGap connect-pageinfo upev-bg "
//           style={{ backgroundImage: "url(" + pageInfo.image + ")" }}
//         >
//           <div className="container-fluid pl-0">
//             <div
//               className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6  connect-info"
//               style={{ backgroundColor: "#fff" }}
//             >
//               <div className="aboutSection__content  about-connect">
//                 <p>
//                   {pageInfo.content}
//                   <span>{connectParaSpan}</span>
//                 </p>
//                 <Link to="/admin2/" className="btn btn-lg btn-primary">
//                   VCAT CONNECT
//                 </Link>
//               </div>
//             </div>
//             <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 connect-pageinfo-image  ">
//               <div className=" right-full-image">
//                 <img src={pageInfo.option_1} alt="pageinfo" width="100%" />
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

// // "https://vcat.co.in/admin2"

// export default Connect;

import React, { Component } from "react";
import { callApi } from "../libraries/Api";
import { Link } from "react-router-dom";

class Connect extends Component {
  state = {
    bannerData: [],
    pageInfo: [],
    connectParaSpan: "",
  };

  componentDidMount() {
    const functionUrl = "pages";
    const requestBody = {
      page: "connect",
    };
    callApi(functionUrl, requestBody).then((response) => {
      if (response.status === "success") {
        const result = response.result;
        this.setState({
          bannerData: result.bannerData[0],
          pageInfo: result.pageInfo[0],
        });
      }
    });
    // call API
    this.setState({
      connectParaSpan:
        "The purpose of the meet was to develop fellowship among CA’s of Bangalore. It was attended by seniors, middle aged and the newly qualified CA’s. The outcome was very encouraging whereby the casual meet on a usual Sunday became an extra ordinary Sunday which enabled formation of your Charitable Trust.",
    });
  }

  render() {
    const { bannerData, pageInfo, connectParaSpan } = this.state;
    return (
      <div className="">
        {/* <!-- section1: navbar, hero carousel --> */}
        <section className="mg-top">
          <div
            className="sub-herosection connect-page abouthero-bg"
            style={{ backgroundImage: "url(" + bannerData.image + ")" }}
          >
            <div className="container-wrapper ">
              <div className="overlay boxShadow">
                <div className="carl-caption text-start">
                  <h1>{bannerData.title}</h1>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        bannerData.content === null || bannerData.content === ""
                          ? "No Content"
                          : bannerData.content,
                    }}
                  ></p>
                  <Link
                    className="btn btn-lg btn-primary boxShadow"
                    to="https://admin.vcat.co.in/"
                  >
                    {" "}
                    VCAT CONNECT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- section2: About Us --> */}
        <section
          className="aboutSection sectionGap connect-pageinfo upev-bg "
          style={{ backgroundImage: "url(" + pageInfo.image + ")" }}
        >
          <div className="container-fluid pl-0">
            <div
              className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6  connect-info"
              style={{ backgroundColor: "#fff" }}
            >
              <div className="aboutSection__content  about-connect">
                <p>
                  {pageInfo.content}
                  <span>{connectParaSpan}</span>
                </p>
                <Link
                  to="https://admin.vcat.co.in/"
                  className="btn btn-lg btn-primary"
                >
                  VCAT CONNECT
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-6 connect-pageinfo-image  ">
              <div className=" right-full-image">
                <img src={pageInfo.option_1} alt="pageinfo" width="100%" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Connect;

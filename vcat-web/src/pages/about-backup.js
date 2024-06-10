import React, { Component } from 'react'
import { callApi } from '../libraries/Api';

class About extends Component {
    state = {
        aboutTitle: '',
        aboutInfo: '',
        aboutPara: '',
        aboutImage: '',
        aboutLeaderHead1: '',
        aboutLeaderHead2: '',
        aboutLeaderHead3: '',
        aboutLeaderName1: '',
        aboutLeaderPos1: '',
        aboutLeaderName2: '',
        aboutLeaderPos2: '',
        aboutLeaderName3: '',
        aboutLeaderPos3: '',
        aboutLeaderName4: '',
        aboutLeaderPos4: '',
        aboutLeaderName5: '',
        aboutLeaderPos5: '',
        aboutLeaderName6: '',
        aboutLeaderPos6: '',
        aboutLeaderName7: '',
        aboutLeaderPos7: '',
        aboutLeaderName8: '',
        aboutLeaderPos8: '',
        aboutLeaderName9: '',
        aboutLeaderPos9: '',
        aboutLeaderName10: '',
        aboutLeaderPos10: '',
        aboutLeaderName11: '',
        aboutLeaderPos11: '',
        aboutLeaderName12: '',
        aboutLeaderPos12: '',
    }

    componentDidMount() {
        const functionUrl = 'pages';
        const requestBody = {
            'AboutPage': 'about'
        };
        callApi(functionUrl, requestBody).then((response) => {
            console.log(response);
            if (response.statusCode === 200) {
                // const result = response.result;
                // this.setState({
                //     heroTitle: response.result.key,
                //     banner: response.result.banner 
                // });
            }
        });
        // call API
        this.setState({
            aboutTitle: 'ABOUT US',
            aboutInfo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta fugiat quia beatae,Lorem ipsum ',
            aboutPara: "Sri Vasavi CA Charitable Trust (VCAT) It was an usual Sunday on 10th December, 2006, where a casual meet of Chartered Accountants (CA’s) belonging to Arya Vysya Community was attended by 106 CA’s. The purpose of the meet was to develop fellowship among CA’s of Bangalore. It was attended by seniors, middle aged and the newly qualified CA’s. The outcome was very encouraging whereby the casual meet on a usual Sunday became an extra ordinary Sunday which enabled formation of your Charitable Trust. 12th March, 2008, saw the dawn of Sri Vasavi CA Charitable Trust (VCAT) formed by 27 CA’s as Authors and 74 CA’s as Life Trustees. The very objective is to provide financial assistance to deserving students, providing hostel facilities and training students to enhance their skill sets apart from enhancing Professional expertise of CAs. VCAT has created a platform for CA’s to discharge their Professional Social Responsibility (PSR) initiatives and is doing commendable job.",
            aboutImage: [
                { image: '' }
            ],
            aboutLeaderHead1: 'BOARD OF TRUSTEES',
            aboutLeaderHead2: 'Mentors',
            aboutLeaderHead3: 'Past Presidents',
            aboutLeaderName1: 'CA. Sreenivas CS',
            aboutLeaderPos1: 'President',
            aboutLeaderName2: 'CA. Sreenivas CS',
            aboutLeaderPos2: 'President',
            aboutLeaderName3: 'CA. Sreenivas CS',
            aboutLeaderPos3: 'President',
            aboutLeaderName4: 'CA. Sreenivas CS',
            aboutLeaderPos4: 'President',
            aboutLeaderName5: 'CA. Sreenivas CS',
            aboutLeaderPos5: 'President',
            aboutLeaderName6: 'CA. Sreenivas CS',
            aboutLeaderPos6: 'President',
            aboutLeaderName7: 'CA. Sreenivas CS',
            aboutLeaderPos7: 'President',
            aboutLeaderName8: 'CA. Sreenivas CS',
            aboutLeaderPos8: 'President',
            aboutLeaderName9: 'CA. Sreenivas CS',
            aboutLeaderPos9: 'President',
            aboutLeaderName10: 'CA. Sreenivas CS',
            aboutLeaderPos10: 'President',
            aboutLeaderName11: 'CA. Sreenivas CS',
            aboutLeaderPos11: 'President',
            aboutLeaderName12: 'CA. Sreenivas CS',
            aboutLeaderPos12: 'President',
        })
    }

    render() {
        const state = this.state;
        return (
            <div>
                <section>
                    <div className="sub-herosection abouthero-bg ">
                        <div className="container-fluid ">

                            <div className="overlay boxShadow ">
                                <div className="carl-caption text-start">
                                    <h1>{state.aboutTitle}</h1>
                                    <p>{state.aboutInfo}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* <!-- section2: About Us --> */}
                <section className="aboutpagesection eventheight">
                    <div className="container-fluid d-flex">
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="aboutpagePara">
                                    <p>{state.aboutPara}</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 hideimg">
                                <div className="aboutpageImgae">
                                    <img src="../img/vcat-side.png" alt="" width="100%" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-team eventheight">
                    <div className="container-fluid">
                        {/* <!-- Start Header Section --> */}
                        <div className="row justify-content-center text-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="header-section">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-sm-2 col-md-4 col-lg-4 col-xl-4">
                                                <h3 className="leader-toggleBtn leaderActive">
                                                    <a href="/">{state.aboutLeaderHead1}</a>
                                                </h3>
                                            </div>
                                            <div className="col-sm-2 col-md-4 col-lg-4 col-xl-4">
                                                <h3 className="leader-toggleBtn">
                                                    <a href="/">{state.aboutLeaderHead2}</a>
                                                </h3>
                                            </div>
                                            <div className="col-sm-2 col-md-4 col-lg-4 col-xl-4">
                                                <h3 className="leader-toggleBtn">
                                                    <a href="/">{state.aboutLeaderHead3}</a>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- / End Header Section --> */}
                        <div className="row">
                            {/* <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName1}</h4>
                                        <span className="speciality">{state.aboutLeaderPos1}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName2}</h4>
                                        <span className="speciality">{state.aboutLeaderPos2}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName3}</h4>
                                        <span className="speciality">{state.aboutLeaderPos3}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName4}</h4>
                                        <span className="speciality">{state.aboutLeaderPos4}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName5}</h4>
                                        <span className="speciality">{state.aboutLeaderPos5}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName6}</h4>
                                        <span className="speciality">{state.aboutLeaderPos6}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName7}</h4>
                                        <span className="speciality">{state.aboutLeaderPos7}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName8}</h4>
                                        <span className="speciality">{state.aboutLeaderPos8}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName9}</h4>
                                        <span className="speciality">{state.aboutLeaderPos9}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName10}</h4>
                                        <span className="speciality">{state.aboutLeaderPos10}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName11}</h4>
                                        <span className="speciality">{state.aboutLeaderPos11}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person -->
                        <!-- Start Single Person --> */}
                            <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
                                <div className="single-person">
                                    <div className="person-image">
                                        <img src="../img/leader.png" alt="" />
                                    </div>
                                    <div className="person-info">
                                        <h4 className="full-name">{state.aboutLeaderName12}</h4>
                                        <span className="speciality">{state.aboutLeaderPos12}</span>
                                    </div>
                                    <div className="social-medialinks">
                                        <a href="/"><i className="bi bi-telephone-fill"></i></a>
                                        <a href="/"><i className="bi bi-envelope-fill"></i></a>
                                        <a href="/"><i className="bi bi-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- / End Single Person --> */}
                        </div>
                    </div>
                </section>
            </div>
        )
    }

}

export default About
// import React, { Component } from 'react'
// import { callApi } from '../libraries/Api';
// import Dropdown from 'react-bootstrap/Dropdown';


// class Wings extends Component {
//     state = {
//         wingsTitle: '',
//         wingsInfo: ' ',
//         wingsCard1title: '',
//         wingsCard2title: '',
//         wingsCard3title: '',
//         wingsCard4title: "",
//         wingsCard5title: "",
//         wingsCard6title: '',
//         wingsCard7title: '',
//         wingsCard8title: '',
//         wingsPara: '',
//         wingsDropButton: '',
//         wingsDropItem1: '',
//         wingsDropItem2: '',
//         wingsDropItem3: '',
//         wingsDropItem4: '',
//         wingsHead1: '',
//         wingsHead2: '',

//         wingsLeaderHead1: '',
//         wingsLeaderHead2: '',
//         wingsLeaderHead3: '',
//         wingsLeaderName1: '',
//         wingsLeaderPos1: '',
//         wingsLeaderName2: '',
//         wingsLeaderPos2: '',
//         wingsLeaderName3: '',
//         wingsLeaderPos3: '',
//         wingsLeaderName4: '',
//         wingsLeaderPos4: '',
//         wingsLeaderName5: '',
//         wingsLeaderPos5: '',
//         wingsLeaderName6: '',
//         wingsLeaderPos6: '',
//         wingsLeaderName7: '',
//         wingsLeaderPos7: '',
//         wingsLeaderName8: '',
//         wingsLeaderPos8: '',
//         wingsLeaderName9: '',
//         wingsLeaderPos9: '',
//         wingsLeaderName10: '',
//         wingsLeaderPos10: '',
//         wingsLeaderName11: '',
//         wingsLeaderPos11: '',
//         wingsLeaderName12: '',
//         wingsLeaderPos12: '',

//     }

//     componentDidMount() {
//         const functionUrl = 'pages';
//         const requestBody = {
//             'WingsPage': 'wing'
//         };
//         callApi(functionUrl, requestBody).then((response) => {
//             console.log(response);
//             if (response.statusCode === 200) {
//                 // const result = response.result;
//                 // this.setState({
//                 //     heroTitle: response.result.key,
//                 //     banner: response.result.banner 
//                 // });
//             }
//         });
//         // call API
//         this.setState({
//             wingsTitle: 'Wings',
//             wingsInfo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta fugiat quia beatae,Lorem ipsum ',
//             wingsCard1title: 'Membership Development',
//             wingsCard2title: 'Vidhyadhara',
//             wingsCard3title: 'Techwing',
//             wingsCard4title: "Student's Welfare",
//             wingsCard5title: "Women's Wing",
//             wingsCard6title: 'Cultural & Social Wing',
//             wingsCard7title: 'T&D',
//             wingsCard8title: 'IDFR',
//             wingsPara: "Sri Vasavi CA Charitable Trust (VCAT) It was an usual Sunday on 10th December, 2006, where a casual meet of Chartered Accountants (CA’s) belonging to Arya Vysya Community was attended by 106 CA’s. The purpose of the meet was to develop fellowship among CA’s of Bangalore. It was attended by seniors, middle aged and the newly qualified CA’s. The outcome was very encouraging whereby the casual meet on a usual Sunday became an extra ordinary Sunday which enabled formation of your Charitable Trust. 12th March, 2008, saw the dawn of Sri Vasavi CA Charitable Trust (VCAT) formed by 27 CA’s as Authors and 74 CA’s as Life Trustees. The very objective is to provide financial assistance to deserving students, providing hostel facilities and training students to enhance their skill sets apart from enhancing Professional expertise of CAs. VCAT has created a platform for CA’s to discharge their Professional Social Responsibility (PSR) initiatives and is doing commendable job.",
//             wingsDropButton: 'Select Wing',
//             wingsDropItem1: 'Action',
//             wingsDropItem2: 'Another action',
//             wingsDropItem3: 'Something else here',
//             wingsHead1: 'WINGS',
//             wingsHead2: 'MEMBERSHIP DEVELOPMENT',

//             wingsLeaderHead1: 'BOARD OF TRUSTEES',
//             wingsLeaderHead2: 'Mentors',
//             wingsLeaderHead3: 'Past Presidents',
//             wingsLeaderName1: 'CA. Sreenivas CS',
//             wingsLeaderPos1: 'President',
//             wingsLeaderName2: 'CA. Sreenivas CS',
//             wingsLeaderPos2: 'President',
//             wingsLeaderName3: 'CA. Sreenivas CS',
//             wingsLeaderPos3: 'President',
//             wingsLeaderName4: 'CA. Sreenivas CS',
//             wingsLeaderPos4: 'President',
//             wingsLeaderName5: 'CA. Sreenivas CS',
//             wingsLeaderPos5: 'President',
//             wingsLeaderName6: 'CA. Sreenivas CS',
//             wingsLeaderPos6: 'President',
//             wingsLeaderName7: 'CA. Sreenivas CS',
//             wingsLeaderPos7: 'President',
//             wingsLeaderName8: 'CA. Sreenivas CS',
//             wingsLeaderPos8: 'President',
//             wingsLeaderName9: 'CA. Sreenivas CS',
//             wingsLeaderPos9: 'President',
//             wingsLeaderName10: 'CA. Sreenivas CS',
//             wingsLeaderPos10: 'President',
//             wingsLeaderName11: 'CA. Sreenivas CS',
//             wingsLeaderPos11: 'President',
//             wingsLeaderName12: 'CA. Sreenivas CS',
//             wingsLeaderPos12: 'President',

//         })
//     }
//     render() {
//         const state = this.state;
//         return (
//             <div>
//                 <section>
//                     <div id="header"></div>
//                     <div className="sub-herosection abouthero-bg">
//                         <div className="container-fluid">
//                             <div className="overlay boxShadow ">
//                                 <div className="carl-caption text-start">
//                                     <h1>{state.wingsTitle}</h1>
//                                     <p>{state.wingsInfo}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 {/* <!-- section2--> */}
//                 <section className="aboutpagesection eventheight wingsSection">
//                     <div className="container-fluid d-flex">
//                         <div className="row">
//                             <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//                                 <div className="aboutpagePara">
//                                     <h3 className='textleft'>{state.wingsHead1}</h3>
//                                     <div className="headingDropdown">
//                                         <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
//                                             <h2 className='textleft'>{state.wingsHead2}</h2>
//                                         </div>
//                                         <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 rigthlarge">
//                                             <div className="dropdown container" ref={this.container}>
//                                                 <Dropdown>
//                                                     <Dropdown.Toggle className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
//                                                         {state.wingsDropButton}
//                                                     </Dropdown.Toggle>

//                                                     <Dropdown.Menu className="dropdown-menu dropdown" aria-labelledby="dropdownMenuButton1">
//                                                         <Dropdown.Item className="dropdown-item" href="#/action-1">{state.wingsDropItem1}</Dropdown.Item>
//                                                         <Dropdown.Item className="dropdown-item" href="#/action-2">{state.wingsDropItem2}</Dropdown.Item>
//                                                         <Dropdown.Item className="dropdown-item" href="#/action-3">{state.wingsDropItem3}</Dropdown.Item>
//                                                     </Dropdown.Menu>
//                                                 </Dropdown>
//                                             </div>

//                                         </div>
//                                     </div>
//                                     <p className='textleft'>{state.wingsPara}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="section-team eventheight no-background">
//                         <div className="container-fluid">
//                             <div className="row">
//                                 {/* <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName1}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos1}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName2}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos2}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName3}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos3}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName4}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos4}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName5}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos5}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName6}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos6}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName7}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos7}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName8}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos8}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName9}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos9}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName10}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos10}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName11}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos11}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person -->
//                                 <!-- Start Single Person --> */}
//                                 <div className="col-6 col-sm-3 col-lg-3 col-xl-2">
//                                     <div className="single-person">
//                                         <div className="person-image">
//                                             <img src="../img/leader.png" alt="" />
//                                         </div>
//                                         <div className="person-info">
//                                             <h4 className="full-name">{state.wingsLeaderName1}</h4>
//                                             <span className="speciality">{state.wingsLeaderPos12}</span>
//                                         </div>
//                                         <div className="social-medialinks">
//                                             <a href="/"><i className="bi bi-telephone-fill"></i></a>
//                                             <a href="/"><i className="bi bi-envelope-fill"></i></a>
//                                             <a href="/"><i className="bi bi-instagram"></i></a>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* <!-- / End Single Person --> */}
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>


//         );
//     }
// }
// export default Wings

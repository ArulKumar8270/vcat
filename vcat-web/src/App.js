import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import "./components/css/main.css";
import "./components/css/pagestyle.css";
import "./components/css/sample.css";
import Wings from "./pages/Wings";
import Events from "./pages/Events";
import Connect from "./pages/Connect";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import { Footer, Header } from "./components";
import GotoTop from "./modals/GotoTop";
import ScrollToTop from "./modals/ScrollToTop";
import Loader from "./components/Loader";
import { observer } from "mobx-react";
import ToastMessage from "./modals/ToastMessage";
import NewEvents from "./pages/NewEvents";
import EventsDetails from "./components/EventsDetails";
import Dimensions from "./modals/Dimensions";
import Gallery from "./pages/Gallery";

const App = observer(() => {
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  useEffect(() => {
    function handleWindowResize() {
      const { innerWidth, innerHeight } = getWindowSize();
      Dimensions.setWindowDimensions(innerWidth, innerHeight);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      <Loader />
      <Header />
      <ScrollToTop />
      <ToastMessage />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/wing" component={Wings} />
        <Route exact path="/event" component={NewEvents} />
        {/* <Route exact path="/new_event" component={NewEvents} /> */}
        <Route exact path="/connect" component={Connect} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/resource" component={Resources} />
        <Route exact path="/event_details" component={EventsDetails} />
        <Route exact path="/gallery" component={Gallery} />
        {/* <Route
          path="/admin2/"
          component={() => {
            window.location.href = "https://vcat.co.in/admin2/";
            return null;
          }}
        /> */}
        <GotoTop />
      </Switch>
      <Footer />
    </>
  );
});

export default App;

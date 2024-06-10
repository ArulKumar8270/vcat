import React from 'react'

const HeroBanner = () => {
    return (
        <div id="myCarousel" className="carousel slide home-banner" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active one">
                    <div className="container overlay boxShadow">
                        <div className="carl-caption text-start">
                            <h1>Heading 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta fugiat quia beatae,</p>
                            <p><a className="btn btn-lg btn-primary boxShadow" href="/">Learn More</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item two">
                    <div className="container overlay boxShadow">
                        <div className="carl-caption text-start ">
                            <h1>Heading 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta fugiat quia beatae,</p>
                            <p><a className="btn btn-lg btn-primary boxShadow" href="/">Learn more</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item three">
                    <div className="container overlay boxShadow">
                        <div className="carl-caption text-start ">
                            <h1>Heading 1</h1>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta fugiat quia beatae,</p>
                            <p><a className="btn btn-lg btn-primary boxShadow" href="/">Learn More</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroBanner

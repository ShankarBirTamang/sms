const HeaderMobile = () => {
    return (
        <>
            <div className="header-mobile py-3">

                <div className="container d-flex flex-stack">

                    <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                        <a href="../../demo9/dist/index.html">
                            <img alt="Logo" src="assets/media/logos/demo9.svg" className="h-35px"/>
                        </a>
                    </div>

                    <button className="btn btn-icon btn-active-color-primary" id="kt_aside_toggle">

								<span className="svg-icon svg-icon-2x me-n1">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
										<path
                                            d="M21 7H3C2.4 7 2 6.6 2 6V4C2 3.4 2.4 3 3 3H21C21.6 3 22 3.4 22 4V6C22 6.6 21.6 7 21 7Z"
                                            fill="currentColor"/>
										<path opacity="0.3"
                                              d="M21 14H3C2.4 14 2 13.6 2 13V11C2 10.4 2.4 10 3 10H21C21.6 10 22 10.4 22 11V13C22 13.6 21.6 14 21 14ZM22 20V18C22 17.4 21.6 17 21 17H3C2.4 17 2 17.4 2 18V20C2 20.6 2.4 21 3 21H21C21.6 21 22 20.6 22 20Z"
                                              fill="currentColor"/>
									</svg>
								</span>

                    </button>

                </div>

            </div>


        </>
    );
};

export default HeaderMobile;
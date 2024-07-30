import React from "react";
import "../Footer/Footer.scss";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { SocialIcon } from "react-social-icons";
function Footer() {
    return (
        <footer className="footer-menu">
            <div className="footer-container">
                <div className="footer-subscribe">
                    <div className="footer-subscribe_content">
                        <h2>Join our Coffee Club & Earn Free Drinks!</h2>
                        <span>
                            Sign up with your phone number to start collecting
                            points for every purchase. Redeem points for free
                            drinks, pastries, and more!
                        </span>
                    </div>
                    <div className="footer-subscribe_form">
                        <form>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter Your Phone Number"
                            />
                            <button type="submit">Join Now</button>
                        </form>
                    </div>
                </div>

                <div className="footer-info">
                    <div className="footer-schedule">
                        <h4 className="widget-title">Working Hours</h4>
                        <div class="work-hour">
                            <ul>
                                <li>
                                    Monday - Friday
                                    <span class="table-text">
                                        8.00 AM - 9.00 PM
                                    </span>
                                </li>
                                <li>
                                    Saturday <span>9.00 AM - 9.00 PM</span>
                                </li>
                                <li class="table-brb">
                                    Sunday <span>9.00 AM - 6.00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h4 className="widget-title">Contact Us</h4>
                        <div class="contact-info">
                            <p>
                                <div className="contact-icons">
                                    <FaPhoneAlt size={16} />
                                </div>
                                Phone Number <br /> +84 912-345-678
                            </p>
                            <p>
                                <div className="contact-icons">
                                    <FaEnvelope size={16} />
                                </div>
                                E-Mail
                                <br />
                                example@gmail.com
                            </p>
                            <p>
                                {" "}
                                <div className="contact-icons">
                                    <FaLocationDot size={16} />
                                </div>
                                Location
                                <br />
                                255A Pham Ngu Lao, District 1, HCMC
                            </p>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div class="footer-bottom-social">
                        <SocialIcon
                            className="social-icons"
                            url="https://www.youtube.com/"
                        />
                        <SocialIcon
                            className="social-icons"
                            url="https://www.facebook.com/"
                        />
                        <SocialIcon
                            className="social-icons"
                            url="https://www.instagram.com/"
                        />
                        <SocialIcon
                            className="social-icons"
                            url="https://www.tiktok.com/"
                        />
                    </div>
                    <div class="footer-bottom-copy">
                        <p>
                            Copyright © 2024 <span>CoffeeShop</span>. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

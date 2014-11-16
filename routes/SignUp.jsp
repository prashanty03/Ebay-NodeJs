<%@ page language="java" contentType="text/html; charset=UTF-8"
   pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Sign Up | Yelp</title>
      <link href="https://s3-media4.fl.yelpcdn.com/assets/2/www/css/1f99e8f7aba1/www-pkg.css" media="all" type="text/css" rel="stylesheet">
      <link href="https://s3-media3.fl.yelpcdn.com/assets/2/www/css/a4570fff5f3f/signup/signup.css" media="all" type="text/css" rel="stylesheet">
      <link href="https://s3-media1.fl.yelpcdn.com/assets/2/www/css/0e229d4f5977/signup/landing_picture.css" media="all" type="text/css" rel="stylesheet">
   </head>
   <body class="country-us logged-out ytype jquery" id="yelp_main_body">
      <div id="fb-root" class=" fb_reset">
         <div style="position: absolute; top: -10000px; height: 0px; width: 0px;">
            <div><iframe frameborder="0" name="fb_xdm_frame_https" allowtransparency="true" scrolling="no" id="fb_xdm_frame_https" aria-hidden="true" title="Facebook Cross Domain Communication Frame" tabindex="-1" style="border: medium none;" src="https://s-static.ak.facebook.com/connect/xd_arbiter/2_ZudbRXWRs.js?version=41#channel=f3f71f4ad73c15c&amp;origin=https%3A%2F%2Fwww.yelp.com"></iframe></div>
         </div>
         <div style="position: absolute; top: -10000px; height: 0px; width: 0px;">
            <div></div>
         </div>
      </div>
      <div class="lang-en" id="wrap">
      <div>
         <div class="app-header simple-header">
            <div class="header-container clearfix">
               <h1 id="logo" class="logo">
                  <a href="/">Yelp</a>
               </h1>
            </div>
         </div>
      </div>
      <div id="print-masthead">
         <img alt="Yelp" class="print-bkg-img" src="https://s3-media2.fl.yelpcdn.com/assets/2/www/img/b7e9d647188d/gfx/header_print.gif">
      </div>
      <span class="offscreen" id="page-content">&nbsp;</span>
      <div id="super-container">
         <div id="alert-container">
            <div class="alert" data-component-bound="true" style="display: none;">
               <a href="#" class="alert-dismiss">×</a>
               <p class="alert-message"></p>
            </div>
         </div>
         <div class="clearfix">
            <div class="signup-wrapper">
               <div class="signup-flow on-flow-start" data-component-bound="true">
                  <div class="flow-start signup-visible" data-component-bound="true">
                     <div class="embossed-box">
                        <div class="signup-form-container">
                           <div class="header">
                              <h2>Sign up for Yelp</h2>
                           </div>
                           <form method="POST" id="signup-form" class="yform signup-form  city-hidden" action="/signup">
                              <input type="hidden" value="89ad8b30808f0781a41d4e7efce851e938093e6d05d248636b89214d01d3f479" class="csrftok" name="csrftok">
                              <ul class="inline-layout clearfix">
                                 <li>
                                    <label class="placeholder-sub">First Name</label>
                                    <input type="text" value="" required="required" placeholder="First Name" name="first_name" id="first_name">
                                 </li>
                                 <li>
                                    <label class="placeholder-sub">Last Name</label>
                                    <input type="text" value="" required="required" placeholder="Last Name" name="last_name" id="last_name">
                                 </li>
                              </ul>
                              <label class="placeholder-sub">Email</label>
                              <input type="email" value="" required="required" placeholder="Email" name="email" id="email">
                              <label class="placeholder-sub">Password</label>
                              <input type="password" value="" required="required" placeholder="Password" name="password" id="password">
                              <div id="signup-captcha" class="captcha"></div>
                              <p class="legal-copy legal-left">
                                 By creating an account, you agree to Yelp’s     <a href="http://www.yelp.com/static?p=tos" class="legal-link">Terms of Service</a>
                                 and     <a href="/tos/privacy_en_us_20130910" class="legal-link">Privacy Policy</a>
                                 .
                              </p>
                              <button class="ybtn ybtn-primary ytype disable-on-submit submit signup-button" value="Sign Up" type="submit" id="signup-button"><span>Sign Up</span></button>
                           </form>
                        </div>
                        <div class="sub-text-box">
                           <small class="subtle-text">Already on Yelp? <a class="login-link">Log in</a></small>
                        </div>
                     </div>
                  </div>
                  <div class="facebook" data-component-bound="true">
                  </div>
                  <div class="extra" data-component-bound="true">
                  </div>
               </div>
            </div>
            <div class="picture-container">
               <img src="https://s3-media4.fl.yelpcdn.com/assets/2/www/img/1e82406ff345/signup/signup_illustration.png">
            </div>
         </div>
      </div>
      <div class="footer">
         <div class="footer-wrap">
            <div class="footer-menu-wrap clearfix">
               <div class="city-landscape-img"></div>
               <div class="footer-copyright">
                  <small>
                  Copyright &copy; 2004&ndash;2014 Yelp Inc. Yelp, <img class="footer-copyright-logo" alt="Yelp logo" src="https://s3-media4.fl.yelpcdn.com/assets/2/www/img/9d213bfb766e/logo/logo_tiny.png">, <img class="footer-burst-logo" alt="Yelp burst" src="https://s3-media3.fl.yelpcdn.com/assets/2/www/img/86ec59fef415/logo/burst_tiny.png"> and related marks are registered trademarks of Yelp.
                  </small>
               </div>
            </div>
         </div>
      </div>
   </body>
</html>
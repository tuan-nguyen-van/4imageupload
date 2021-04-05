<div class="section-title text-center" id="theming-section">
    Customize your theme then download
</div>

<div class="text-guide mb-3">
    Select components that you need and test them freely in demo. Everything is configurable with little lines of code.
</div>
<div id="component-configuration">
    <div class="row theme-class text-white">
        <style media="screen">
            .theme-class .custom-control-label::before {
                border: #1155cc solid 1px;
            }
            .theme-class .custom-control {
                margin-top: 0.7rem;
            }
        </style>
        <div class="col-md-4">
            <h5 class="mt-3">Image Upload Zone</h5>
            <div class="ml-2">

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" checked id="smallButton" name="imageUploadZone" value="small button">
                    <label class="custom-control-label" for="smallButton">Small Upload Button</label>
                </div>

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="largeZone" name="imageUploadZone" value="large zone">
                    <label class="custom-control-label" for="largeZone">Large Upload Zone</label>
                </div>

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="imageLike" name="imageUploadZone" value="image like">
                    <label class="custom-control-label" for="imageLike">Image Like Upload Zone</label>
                </div>

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="singleLine" name="imageUploadZone" value="single line">
                    <label class="custom-control-label" for="singleLine">Single Line Upload Zone</label>
                </div>
            </div>

        </div>

        <div class="col-md-4">
            <h5 class="mt-3">Progress Bar</h5>
            <div class="ml-2">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" checked id="centerProgress" name="progressBar" value="bar center">
                    <label class="custom-control-label" for="centerProgress">Progress Bar Center</label>
                </div>

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="bottomProgress" name="progressBar" value="bar bottom">
                    <label class="custom-control-label" for="bottomProgress">Progress Bar Bottom</label>
                </div>

                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="spinnerProgress" name="progressBar" value="spinner">
                    <label class="custom-control-label" for="spinnerProgress">Progress Spinner</label>
                </div>

                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="hidePercentText" name="hidePercentText" value="true">
                    <label class="custom-control-label" for="hidePercentText">Hide Percent Text</label>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <h5 class="mt-3">Image Padding</h5>

            <div class="ml-2">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="noPadding" value="0" name="padding">
                    <label class="custom-control-label" for="noPadding">No Padding</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" checked id="2pxPadding" value="2px" name="padding">
                    <label class="custom-control-label" for="2pxPadding">2px</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="5pxPadding" value="5px" name="padding">
                    <label class="custom-control-label" for="5pxPadding">5px</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="10pxPadding" value="10px" name="padding">
                    <label class="custom-control-label" for="10pxPadding">10px</label>
                </div>
            </div>
        </div>

    </div>

    <div class="row theme-class text-white">
        <div class="col-md-4">
            <h5 class="mt-3">Custom Select</h5>

            <div class="ml-2">
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" checked id="blueColor" name="customSelectColor" value="blue">
                    <label class="custom-control-label" for="blueColor">Blue</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="darkColor" name="customSelectColor" value="dark">
                    <label class="custom-control-label" for="darkColor">Dark</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="whiteColor" name="customSelectColor" value="white">
                    <label class="custom-control-label" for="whiteColor">White</label>
                </div>
                <h5 class="mt-3">Flash Box</h5>
                <div class="ml-2">
                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" checked id="borderSide" name="flashBox" value="border side">
                        <label class="custom-control-label" for="borderSide">Border Side Flash Box</label>
                    </div>

                    <div class="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="alertFlashBox" name="flashBox" value="like alert">
                        <label class="custom-control-label" for="alertFlashBox">Like Alert Flash Box</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <h5 class="mt-3">Other</h5>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeSelectOrder" name="selectOrder" checked value="true">
                <label class="custom-control-label" for="themeSelectOrder">selectOrder</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeCustomSelect" name="customSelect" checked value="true">
                <label class="custom-control-label" for="themeCustomSelect">customSelect</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeDisplayImageOrderNumber" name="displayImageOrderNumber" checked value="true">
                <label class="custom-control-label" for="themeDisplayImageOrderNumber">displayImageNumber</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeDeleteImageButton" name="displayDeleteImageButton" checked value="true">
                <label class="custom-control-label" for="themeDeleteImageButton">deleteImageButton</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeAllowDragImage" name="allowDragImage" checked value="true">
                <label class="custom-control-label" for="themeAllowDragImage">allowDragImage</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeDisplayPreviewImage" name="displayPreviewImage" checked value="true">
                <label class="custom-control-label" for="themeDisplayPreviewImage">displayPreviewImage</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeAllowSameImage" name="allowSameImage" value="true">
                <label class="custom-control-label" for="themeAllowSameImage">allowSameImage</label>
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="themeAddLogo" name="addLogo" checked value="true">
                <label class="custom-control-label" for="themeAddLogo">addLogo</label>
            </div>
        </div>
        <div class="col-md-4">
            <h5 class="mt-3">Other</h5>
            <select name="maxCustomSelectOptions" class="custom-select mb-3">
                <option selected value = ''>maxCustomSelectOptions</option>
                <option value="7">7</option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
            </select>
            <select name="maxImageColumns" class="custom-select mb-3">
                <option selected value = ''>maxImageCoumns</option>
                <option value="8">8</option>
                <option value="7">7</option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
            </select>
            <select name="minImageColumns" class="custom-select mb-3">
                <option selected value = ''>minImageColumns</option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="2">1</option>
            </select>
            <select name="minImageWidth" class="custom-select">
                <option selected value = ''>minImageWidth</option>
                <option value="300">300</option>
                <option value="275">275</option>
                <option value="250">250</option>
                <option value="225">225</option>
                <option value="200">200</option>
                <option value="175">175</option>
                <option value="150">150</option>
                <option value="125">125</option>
                <option value="100">100</option>
            </select>
        </div>
    </div>
</div>


<div class="content-block">
    <div class="section-title text-center">
        4 Image Upload Demo
    </div>
    <div class="text-guide text-center">
        Test them freely on computers and mobile devices across all modern browsers.
    </div>
    <div class="text-info content-block" id="image-upload-demo">
        <div id="demo-section">

        </div>
        <div class="text-center download-button donate-input-and-button" style="margin-top: 1rem;">
            DOWNLOAD NOW IS FREE
        </div>
        <div class="text-guide">
            Contact: tuan.nv.vina@gmail.com if you found bugs, send feedback,
            want me to develop more features or write other javascript frameworks.
        </div>
    </div>
</div>

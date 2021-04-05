@keyframes iu-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.iu-percent-div {
    font-size: 1rem;
    color: white;
    width: 80px;
    height: 60px;
    vertical-align: middle;
    line-height: 60px; /* The same as the div height */
    text-align: center;
}

.iu-progress-spinner {
    border-top: 6px solid #0099ff;
    border-right: 6px solid #38afff;
    border-bottom: 6px solid #38afff;
    border-left: 6px solid #38afff;
    border-radius: 50%;
    width: 50%;
    animation: iu-spin 700ms linear infinite;
}

.iu-percent-div, .iu-progress-spinner {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
}

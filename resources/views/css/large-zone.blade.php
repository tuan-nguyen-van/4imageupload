#iu-image-upload-zone {
    min-height: 150px;
    border: 2px dashed #a7a6ab;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    flex: 1 1 100%;
    text-align: center;
    vertical-align: top;
    margin-top: 16px;
}
#iu-image-upload-zone:hover {
    border: 2px dashed #17a2b8;
}
.iu-image-note {
    font-weight: 700;
}
#iu-image-upload-zone input[type=file], /* FF, IE7+, chrome (except button) */
#iu-image-upload-zone input[type=file]::-webkit-file-upload-button { /* chromes and blink button */
    cursor: pointer;
}

/* Spinner for image upload note */
.iu-spinner {
  border-top: 5px solid #3498db;
  border-right: 5px solid #67b2e4;
  border-bottom: 5px solid #67b2e4;
  border-left: 5px solid #67b2e4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: iu-spin 700ms linear infinite;
  margin: auto;
  margin-top: 10px;
}

@keyframes iu-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

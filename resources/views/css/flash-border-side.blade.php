.iu-flash-box {
    position: fixed;
    z-index: 2000;
    color: #ffffff;
    background: rgba(37,34,74,.9);
}

@media (max-width: 450px) {
    .iu-flash-box {
        padding: 20px 20px;
        animation: MoveDown 0.2s linear;
        top: 0px;
        width: 100%;
        border-radius: 0 0 25px 25px;
    }
}

@keyframes MoveDown {
  0%{
    margin-top: -54px;
  }
  100% {
    margin-top: 0px;
  }
}


@media (min-width: 451px) {
    .iu-flash-box {
        animation: MoveLeft 0.2s linear;
        padding: 10px 30px;
        max-width: 50%;
        bottom: 10px;
        right: 10px;
        border-radius: 30px;
        opacity: 1;
    }
}

@keyframes MoveLeft {
  0%{
    margin-right: -50%;
  }
  100% {
    margin-right: 10px;
  }
}

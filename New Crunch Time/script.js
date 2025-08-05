.body {
    margin: 0;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

.slideshow-container {
    position: relative;
    width: 100%;
    height: 100vh;
}

.slide {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.5s ease-in-out;
}

.slide.active {
    display: block;
    opacity: 1;
}

.background-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.background-link {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

.center-img {
    display: block;
    margin: 10% auto;
    max-width: 50%;
    max-height: 50%;
    object-fit: contain;
}

.text-content {
    position: absolute;
    bottom: 20%;
    width: 100%;
    text-align: center;
    color: #fff;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
    z-index: 1;
}

.text-content h2 {
    font-size: 2em;
    margin: 0;
}

.text-content p {
    font-size: 1.2em;
    margin: 10px 0 0;
}

.skip-btn {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px 20px;
    cursor: pointer;
    z-index: 2;
}

.dots {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    z-index: 2;
}

.dot {
    height: 10px;
    width: 10px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    margin: 0 5px;
    cursor: pointer;
}

.dot.active {
    background-color: red;
}

.next-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: transparent;
    border: none;
    font-size: 2em;
    color: #fff;
    cursor: pointer;
    z-index: 2;
}

#slide2, #slide3 {
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#slide2 .text-content, #slide3 .text-content {
    color: #333;
    text-shadow: none;
}

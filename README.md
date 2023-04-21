# PixelEyes
## Overview

___

**Pixel-eyes** is a open-source library built on Node.js with Typescript that takes screenshots of web pages and compares them.

Under the hood it makes use of Puppeteer for the screenshots, Jimp for the URL to Buffer conversion and Pixelmatch to compare the images pixel by pixel. It also makes use of NestJS as a wrapper for Commander (used to build the CLI command structure) and Sequelize (as ORM for the SQLite Database).

This project was developed by [Simtech](link to simtech website).

## Table of Contents

___

- Installation
- Getting Started
    - Commands Summary
- Contributing
- Join SMTH Community
- Code of Conduct
- Licence

## Installation

___

To install **Pixel-eyes** you can use npm:

```bash
npm install pixeleyes
```

or use curl:

```bash
curl #link
```

Alternatively if you want to contribute to this lib you can clone the repo (use SSH keys to authenticate):

```bash
git clone git@github.com:smth-academy/pixel-eyes.git
```

## Getting Started

___

To use **Pixel-eyes** you need to call the command __**pixeleyes**__ and pass the URL of the web page you want to screenshot in double quotes:

```bash
pixeleyes "https://your.domain.here/"
```

The program will check if the URL has been inputted.
> In this context, we shall refer to "Sampler" as the sampler image, while "Differ" will be the images to be compared to the "Sampler".
Puppeteer will open a Chromium session on the given URL and wait for an event to load, after which the screenshot is taken. The program will then check the DB in the Samplers table if the inputted URL is already present:

- if it's not, the screenshot will be saved in the storage/ directory as a .png file and the URL will be recorded in the Samplers table;
- if it is, the screenshot will be saved in the storage/ directory as a .png file and the URL will be recorded in the Differs table and the comparing process will start;

Pixelmatch will handle the comparing process by taking the Differ and compare it with the Sampler having the same URL. Jimp will convert both URLs into buffers ***todo finish***

The program will then output the following values for the Diffed:
- **Image Resolution:** width and height of the image;
- **MSE:** Mean Square Error value (between 0 and 1, increasing with the difference between the images);
- **Similarity between the two images:** value of similarities between Sampler and Differ in %;
- **Percent of mismatched pixels:** value of different pixels (Red) in %;
- **Percent of dark on ligth pixels:** value of the difference between added and removed parts (Purple) in %;
- **Percent of anti-aliased pixels:** value of antialiasing (if enabled, in Yellow) in %;
- **Number of total pixels:** the total amount of pixels in the Diffed;
- **Number of mismatched pixels:** value of different pixels (Red);



## Join SMTH Community
![Discord Banner 2](https://discordapp.com/api/guilds/748546400631128204/widget.png?style=banner2)

[INVITATION LINK](https://discord.gg/H6NkzZy)

## Code of Conduct
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

## License

TODO: Write license
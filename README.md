# Pidash

A personal desktop dashboard, showing Github contributions and a clock, running on a [Raspberry Pi](http://raspberrypi.org) and an [Adafruit PiTFT display](https://www.adafruit.com/products/1601).

Pidash is written in NodeJS, and uses RxJS to manage asynchronous event streams.

![screenshot](https://cloud.githubusercontent.com/assets/47222/11027498/a531803a-866a-11e5-8555-56e8c5a2bbdf.png)

## Installation

1. Setup your PiTFT
  1. Install [Adafruit's PiTFT helper](https://github.com/adafruit/Adafruit-PiTFT-Helper):
```
curl -SLs https://apt.adafruit.com/add | sudo bash
sudo apt-get install raspberrypi-bootloader
sudo apt-get install adafruit-pitft-helper
```

  2. Configure the PiTFT:
```
sudo adafruit-pitft-helper -t 28r
```
_The argument you use here may be different, depending on which TFT you have; run `adafruit-pitft-helper -h` for a list of options_

2. Setup NodeJS to run on boot

  1. Install NodeJS, provided by Adafruit's repo (0.12.6, at the time of this writing)
```
sudo apt-get install -y node
```

  2. Install [PM2](http://pm2.keymetrics.io/)
```
sudo npm install -g pm2
```

  4. Configure PM2 to run as a service on startup
```
sudo pm2 startup -u pi
```

3. Install Pidash

  1. Install Cairo, a dependency of the node-pitft library:
```
sudo apt-get install libcairo2-dev
```
  2. Clone the Pidash repo into the `pi` user's `pidash` directory
```
git clone https://github.com/jstrutz/pidash ~/pidash
```

  3. Install Pidash's NPM dependencies:
```
cd ~/pidash
npm i
```

# edison-arduino101-iot

Edison + Arduino 101 IoT demo

This demo illustrates a simple IoT example by displaying an Arduino 101's IMU (accelerometer / gyroscope) data on a web page. In order to do this, an Intel Edison module is used to receive the data from the Arduino 101 via BLE (Bluetooth Low Energy), then sends it to a web server via WebSockets.

Here's a picture that describes the overall architecture:

![Archiecture](https://raw.githubusercontent.com/drejkim/edison-arduino101-iot/master/images/edison-arduino101-iot.png)

Arduino 101 uses the [CurieBLE library](https://www.arduino.cc/en/Reference/CurieBLE) to broadcast the IMU data via BLE. Edison is responsible for receiving this data using [noble](https://github.com/sandeepmistry/noble), a Node.js BLE central module, and sending it to a separate web server using [socket.io-client](https://github.com/socketio/socket.io-client). The web server&mdash;which also uses Node.js and [socket.io](http://socket.io/)&mdash;is responsible for receiving data from Edison and hosting a web page that displays the IMU data. For more details, see this [blog post](http://drejkim.com/blog/2016/04/08/using-edison-and-arduino-101-together).

## Setting up the demo

### Edison

#### Installing software using opkg

Add [AlexT's unofficial opkg repository](http://alextgalileo.altervista.org/edison-package-repo-configuration-instructions.html). It contains many precompiled packages that can be installed by simply typing `opkg install <package name>`.

To configure the repository, add the following lines to `/etc/opkg/base-feeds.conf`:

```bash
src/gz all http://repo.opkg.net/edison/repo/all
src/gz edison http://repo.opkg.net/edison/repo/edison
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32
```

Update the package manager and install the required packages:

```bash
opkg update
opkg install git systemd-dev
```

#### Setting up Node.js

* Install `async` globally: `npm -g install async`
* Navigate to `edison/` and type `npm install`
* Modify the `socket` variable in `edison/sensors.js` with your web server's URL&mdash;see note below

### Web server

Note: Your web server should NOT be running on the Edison that's running `sensors.js`. It can run on a personal computer, or even on a different Edison.

* Navigate to `web/server/` and type `npm install`
* Modify the `socket variable` in `web/client/app.js` with your web server's URL

## Running the demo

### Arduino 101

Upload the sketch located in `arduino/imu/imu.ino` to your Arduino 101. After a few seconds, it should be ready to go.

### Edison

Navigate to `edison/` and type `node sensors.js` to start the program. The Edison console should look similar to this:

```bash
root@myedison:~# node sensors.js
Start BLE scan...
Connected to peripheral: 984fee0f3980
Discovered IMU service
ax:edison
ay:edison
az:edison
gx:edison
gy:edison
gz:edison
```
If the output only goes up to "Connected to peripheral...", try restarting the program after a few seconds. This can help in discovering the BLE service.

### Web server & client

* Start the web server by navigating to `web/server/` and typing `node server.js`
* Open a browser window and navigate to the web server's URL

You should now see the accelerometer / gyroscope data from your Arduino 101 streaming to the web page!

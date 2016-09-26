#include <CurieBLE.h>
#include <CurieIMU.h>

// Create my own UUIDs; used https://www.uuidgenerator.net/
#define IMU_SERVICE_UUID "2947ac9e-fc38-11e5-86aa-5e5517507c66"
#define AX_CHAR_UUID "2947af14-fc38-11e5-86aa-5e5517507c66"
#define AY_CHAR_UUID "2947b090-fc38-11e5-86aa-5e5517507c66"
#define AZ_CHAR_UUID "2947b180-fc38-11e5-86aa-5e5517507c66"
#define GX_CHAR_UUID "2947b252-fc38-11e5-86aa-5e5517507c66"
#define GY_CHAR_UUID "2947b5ae-fc38-11e5-86aa-5e5517507c66"
#define GZ_CHAR_UUID "2947b694-fc38-11e5-86aa-5e5517507c66"

// Arduino 101 acts as a BLE peripheral
BLEPeripheral blePeripheral;

// IMU data is registered as a BLE service
BLEService imuService(IMU_SERVICE_UUID);

// Each IMU data point is its own characteristic
BLEIntCharacteristic axChar(AX_CHAR_UUID, BLERead | BLENotify);
BLEIntCharacteristic ayChar(AY_CHAR_UUID, BLERead | BLENotify);
BLEIntCharacteristic azChar(AZ_CHAR_UUID, BLERead | BLENotify);
BLEIntCharacteristic gxChar(GX_CHAR_UUID, BLERead | BLENotify);
BLEIntCharacteristic gyChar(GY_CHAR_UUID, BLERead | BLENotify);
BLEIntCharacteristic gzChar(GZ_CHAR_UUID, BLERead | BLENotify);

// Assign pin to indicate BLE connection 
const int INDICATOR_PIN = 13;

int ax = 0;
int ay = 0;
int az = 0;
int gx = 0;
int gy = 0;
int gz = 0;

long previousMillis = 0;

void setup() {
  Serial.begin(9600);

  // Initialize IMU
  Serial.println("Initializing IMU...");
  CurieIMU.begin();
  CurieIMU.autoCalibrateGyroOffset();
  CurieIMU.autoCalibrateAccelerometerOffset(X_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Y_AXIS, 0);
  CurieIMU.autoCalibrateAccelerometerOffset(Z_AXIS, 1);

  // Initialize BLE peripheral
  blePeripheral.setLocalName("IMU");
  blePeripheral.setAdvertisedServiceUuid(imuService.uuid());
  blePeripheral.addAttribute(imuService);
  blePeripheral.addAttribute(axChar);
  blePeripheral.addAttribute(ayChar);
  blePeripheral.addAttribute(azChar);
  blePeripheral.addAttribute(gxChar);
  blePeripheral.addAttribute(gyChar);
  blePeripheral.addAttribute(gzChar);

  // Set initial values
  axChar.setValue(ax);
  ayChar.setValue(ay);
  azChar.setValue(az);
  gxChar.setValue(gx);
  gyChar.setValue(gy);
  gzChar.setValue(gz);
  
  // Now, activate the BLE peripheral
  blePeripheral.begin();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // Check if the connection to the central is active or not
  BLECentral central = blePeripheral.central();

  if(central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    digitalWrite(INDICATOR_PIN, HIGH);
    
    while(central.connected()) {
      updateImuData();
    }
    
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
    digitalWrite(INDICATOR_PIN, LOW);
  }
}

void updateImuData() {
  CurieIMU.readMotionSensor(ax, ay, az, gx, gy, gz);
  
  axChar.setValue(ax);
  ayChar.setValue(ay);
  azChar.setValue(az);
  gxChar.setValue(gx);
  gyChar.setValue(gy);
  gzChar.setValue(gz);

  Serial.print(ax); Serial.print("\t");
  Serial.print(ay); Serial.print("\t");
  Serial.print(az); Serial.print("\t");
  Serial.print(gx); Serial.print("\t");
  Serial.print(gy); Serial.print("\t");
  Serial.print(gz); Serial.print("\t");
  Serial.println("");
}


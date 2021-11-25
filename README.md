# Advanced ESP Client

This repo is setup as a monorepo containing two parts:


### Server

The server folder contains a webserver and client to enable communication from any device, not just ESP32s 


### ESP

The ESP folder contains code to flash on an ESP32 to create standalone clients able to communicate with the server and in later iterations able to communicate between themselves without need for a server using the ESP Now Protocol.
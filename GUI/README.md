#Project P.I.O.T.W.O

## GUI
To start workin with P.I.O.T.W.O GUI, from main project folder write following in console
> cd GUI
>
> bower install
>
> npm install

(sudo if failed)

##MQTT server
To start test mqtt server:

> mosca -v --http-port 3000 --http-bundle --http-static ./ | bunyan